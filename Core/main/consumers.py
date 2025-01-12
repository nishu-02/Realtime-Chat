import base64
import json

from channels.generic.websocket import WebsocketConsumer
from django.core.files.base import ContentFile
from .serializers import UserSerializer, SearchSerializer, RequestSerializer
from django.db.models import Q

from . models import User

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Get the authenticated user from the scope
        user = self.scope['user']

        # If the user is not authenticated, deny the connection
        if not user.is_authenticated:
            self.close()
            return

        # Save the username to use as a group name for this user
        self.username = user.username

        # Add the user to a group using their username
        self.channel_layer.group_add(
            self.username,  # Group name
            self.channel_name  # WebSocket channel name
        )

        # Accept the WebSocket connection
        self.accept()

    def disconnect(self, close_code):
        # Remove the user from the group when disconnecting
        self.channel_layer.group_discard(
            self.username,  # Group name
            self.channel_name  
        )

    
    # Handle Requests

    def receive (self, text_data):
        # Receive message from websocket
        data = json.loads(text_data)
        data_source = data.get('source')
        
        # python dict
        print('receive', json.dumps(data, indent=2))

        # Search / filter users
        if data_source == 'search':
            self.receive_search(data)

        # Make friend request
        elif data_source == 'request.connect':
            self.receive_request_connect(data)

        # Thumbnail upload
        elif data_source == 'thumbnail':
            # Save the thumbnail to the user's profile
            self.receive_thumbnail(data)


    def receive_request_connect(self, data):
        username = data.get('username')
        #Attempt to fetch the receivieng user

        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            print('Error: User does not exist')
            return
        
        #create connection
        connection, _ = Connection.objects.get_or_create(
            sender = self.scope['user'],
            receiver = receiver
        )

        # Serailized Connections
        serialized = RequestSerializer(connection)
        # send back to sender
        self.group_send(connection.sender.username, 'request.coonect', serialized.data)

        # send to receiver
        self.group_send(connection.receiver.username, 'request.connect', serialized.data)

    def search_data(self, data):
        query = data.get('query')

        # Get user from query search term
        users = User.objects.filter(
            Q(username_isstartswith=query) |
            Q(first_name_isstartswith=query) |
            Q(last_name_isstartswith=query) 
        ).exclude(
            # it is building the query in the backend so it hits the database when you say and dont call ourselves
            username=self.username
        )
        # .annotate(
        #     pending_them=Exists
        #     pending_me=...
        #     connected=...
        #     #this doesnt hits the databse multiple times so all query in the single
        # )

        # serialize results
        serailized = SearchSerializer(users, many=True)
        # Send search results back
        send.group_send(self.username, 'search', serialized.data)

    def receive_thumbnail(self, data):
        user = self.scope['user']
        # Save the thumbnail to the user's profile

        # Convert base64 data to django content file
        image_str = data.get('base64')
        image = ContentFile(base64.b64decode(image_str))

        #Update thumbnail filed
        filename = data.get('filename')
        user.thumbnail.save(filename, image, save=True)

        #Serailize the user
        serialized = UserSerializer(user)

        # the post and get dont exist so send updated user data including new Thumbnail
        self.group_send(self.username, 'thumbnail', serialized.data)

        # Catch/all broadcast to client helpers

        def group_send(self, group, source, data):
            response = {
                'type': 'broadcast_group',
                'source': source,
                'data': data
            }

        self.channel_layer.group_send(
            group, response #the response need to be a dict
        )

        #calling this response will call the function name broadcast_group
        def broadcast_group(self, data):
            '''
            data :
                type: 'broadcast_group'
                source: where it is originated from
                data: the data that is being send as dict
            '''
            data.pop('type')
            '''
            return data :
                source: where it is originated from
                data: the data that is being send as dict
            '''
            self.send(text_data=json.dumps(data)) # send the data back to the websocket

        