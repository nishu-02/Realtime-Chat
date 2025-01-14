import json
import base64
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from .serializers import UserSerializer,SearchSerializer, RequestSerializer, FriendSerializer
from .models import User, Connection, Message
from django.db.models import Q, Exists, OuterRef


class ChatConsumer(WebsocketConsumer):



    def connect(self):
        user = self.scope['user']
        print(user,user.is_authenticated)
        if not user.is_authenticated:
            return
        
        self.username = user.username

        async_to_sync(self.channel_layer.group_add)(
            self.username,self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.username,
            self.channel_name
        )

        
    # Handle Requests
    def receive(self, text_data):
        # Receive message from websocket
        data = json.loads(text_data)
        data_source = data.get('source')

        # python dict
        print('receive', json.dumps(data, indent=2))

        if data_source == 'friend.list':
            self.receive_friend_list(data)

        elif data_source == 'message.send':
            self.receive_message_send(data)

        elif data_source == 'request.accept':
            self.receive_request_accept(data)
        # Make friend request
        elif data_source == 'request.connect':
            self.receive_request_connect(data)
        
        # Get request List
        elif data_source == 'request.list':
            self.receive_request_list(data)      
        
        # Search / filter users
        elif data_source == 'search':
            self.receive_search(data)

        # Thumbnail upload
        elif data_source == 'thumbnail':
            # Save the thumbnail to the user's profile
            self.receive_thumbnail(data)

    def receive_friend_list(self, data):
        user = self.scope['user']
        # Get connections for the user
        connection = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            accepted=True
        )
        serialized = FriendSerializer(connection, context={'user':user}, many=True)
        # send data back to the user
        self.send_group(user.username, 'friend.list', serialized.data)

    def receive_message_send(self, data):
        user = self.scope['user']
        connectionId = data.get('connectionId')
        message_text = data.get('message')
        try:
            connection = Connection.objects.get(
                id = connectionId
            )
        except Connection.DoesNotExist:
            print('error connection dont exist')
            return
        
        message = Message.objects.create(
            connection = connection,
            user = user,
            text=message_text
        )


    def receive_request_accept(self, data):
        username = data.get('username')

        try:
            # Fetch connection object
            connection = Connection.objects.get(
                sender__username=username,
                receiver=self.scope['user']
            )   
        except Connection.DoesNotExist:
            print("Error: connection doesn't exist")
            return

        # Update the connection
        connection.accepted = True
        connection.save()

        # Serialize the connection object
        serialized = RequestSerializer(connection)

        # Send accepted request to sender
        self.send_group(
            connection.sender.username, 'request.accept', serialized.data
        )

        # Send accepted request to receiver
        self.send_group(
            connection.receiver.username, 'request.accept', serialized.data
        )


    def receive_request_connect(self, data):
        username = data.get('username')
        # Attempt to fetch the receiving user
        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            print('Error: User does not exist')
            return
        
        # Create connection
        connection, _ = Connection.objects.get_or_create(
            sender=self.scope['user'],
            receiver=receiver
        )

        # Serialized Connections
        serialized = RequestSerializer(connection)

        # Send back to sender
        self.send_group(connection.sender.username, 'request.connect', serialized.data)

        # Send to receiver
        self.send_group(connection.receiver.username, 'request.connect', serialized.data)

    def receive_request_list(self, data):
        user = self.scope['user']
        # Get all connections for the user
        connections = Connection.objects.filter(
            receiver=user,
            accepted=False,
        )
        serialized = RequestSerializer(connections, many=True)

        # Sending list back to the user
        self.send_group(user.username, 'request.list', serialized.data)

    def receive_search(self, data):
        query = data.get('query')
    
        # Get user from query search term
        users = User.objects.filter(
            Q(username__istartswith=query) |
            Q(first_name__istartswith=query) |
            Q(last_name__istartswith=query) 
        ).exclude(
            # Avoid including the current user in the search results
            username=self.username
        ).annotate(
            pending_them=Exists(
                Connection.objects.filter(
                    sender=self.scope['user'],
                    receiver=OuterRef('id'),
                    accepted=False
                ),
            ),
            pending_me=Exists(
                Connection.objects.filter(
                    receiver=OuterRef('id'),
                    sender=self.scope['user'],
                    accepted=False
                ),
            ),    
            connected=Exists(
                Connection.objects.filter(
                    Q(sender=self.scope['user'], receiver=OuterRef('id')) |
                    Q(receiver=self.scope['user'], sender=OuterRef('id')),
                    accepted=True
                )
            ) 
        )

        # print(f"Found users count: {users.count()}")  # Debug print
        # print(f"Found users: {list(users.values())}")r  # Debug print

        # Serialize results
        serialized = SearchSerializer(users, many=True)
        print(f"Serialized users: {serialized.data}")

        # Send search results back
        self.send_group(self.username, 'search', serialized.data)

    def receive_thumbnail(self, data):
        user = self.scope['user']
        # Save the thumbnail to the user's profile

        # Convert base64 data to Django content file
        image_str = data.get('base64')
        image = ContentFile(base64.b64decode(image_str))

        # Update thumbnail field
        filename = data.get('filename')
        user.thumbnail.save(filename, image, save=True)

        # Serialize the user
        serialized = UserSerializer(user)

        # Send updated user data including new thumbnail
        self.send_group(self.username, 'thumbnail', serialized.data)

    # Catch/all broadcast to client helpers
    def send_group(self, group, source, data):
        response = {
            'type': 'broadcast_group',
            'source': source,
            'data': data
        }

        # Send data to the group
        async_to_sync(self.channel_layer.group_send)(
            group,response  # The response needs to be a dict
        )

    # Calling this response will call the function name `broadcast_group`
    def broadcast_group(self, data):
        '''
        event:
            type: 'broadcast_group'
            source: where it is originated from
            data: the data that is being sent as dict
        '''
        data.pop('type')  # Remove the type key

        '''
        Return event:
            source: where it is originated from
            data: the data that is being sent as dict
        '''
        # Send the data back to the WebSocket
        self.send(text_data=json.dumps(data))