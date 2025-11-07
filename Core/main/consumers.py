import json
import base64
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import async_to_sync
from django.core.files.base import ContentFile
from django.utils import timezone
from .serializers import UserSerializer,SearchSerializer, RequestSerializer, FriendSerializer, MessageSerializer
from .models import User, Connection, Message
from django.db.models import Q, Exists, OuterRef
from django.db.models.functions import Coalesce


class ChatConsumer(WebsocketConsumer):

    def connect(self):
        # guard against middleware that may not set 'user' on the scope
        user = self.scope.get('user', AnonymousUser())
        print('connect user:', user, getattr(user, 'is_authenticated', False))
        if not getattr(user, 'is_authenticated', False):
            # reject the connection if user is not authenticated
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
        try:
            # Receive message from websocket
            data = json.loads(text_data)
            data_source = data.get('source')

            # python dict
            print('receive', json.dumps(data, indent=2))

            if data_source == 'friend.list':
                self.receive_friend_list(data)

            elif data_source == 'message.list':
                self.receive_message_list(data)

            elif data_source == 'message.send':
                self.receive_message_send(data)

            # User is typing
            elif data_source == 'message.type':
                self.receive_message_type(data)

            # Message read receipt
            elif data_source == 'message.read':
                self.receive_message_read(data)

            # Message delete
            elif data_source == 'message.delete':
                self.receive_message_delete(data)

            # Message edit
            elif data_source == 'message.edit':
                self.receive_message_edit(data)

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
        except Exception as e:
            print(f'ERROR in receive: {str(e)}')
            import traceback
            traceback.print_exc()

    def receive_friend_list(self, data):
        user = self.scope['user']
        
        #Latest message subquery
        latest_message = Message.objects.filter(
            connection = OuterRef('id')
        ).order_by('-created')[:1]

        # Get connections for the user
        connection = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user),
            accepted=True
        ).annotate(
            latest_text = latest_message.values('text'),
            latest_created = latest_message.values('created')
        ).order_by(
            Coalesce('latest_created', 'updated').desc()
        )

        serialized = FriendSerializer(connection, context={'user':user}, many=True)
        # send data back to the user
        self.send_group(user.username, 'friend.list', serialized.data)

    def receive_message_list(self, data):
        user = self.scope['user']
        connectionId = data.get('connectionId')
        page = data.get('page')
        page_size = 12 
        try:
            connection = Connection.objects.get(id = connectionId)
        except Connection.DoesNotExist:
            return
        
        # Get Messages
        messages = Message.objects.filter(
            connection= connection
        ).order_by('-created')[page * page_size:(page + 1) * page_size]

        # serailizing the message

        # the reason is it not serialized only bacuse we have to send to both persons
        serialized_message = MessageSerializer(
            messages,
            context={
                'user':user
            },
            many=True
        )

        # Get receipient friend
        recipient = connection.sender
        if connection.sender == user:
            recipient = connection.receiver

        # Serialize the friend
        serailized_friend = UserSerializer(recipient)

        # Count the total number of messages for this connection
        messages_count = Message.objects.filter(
            connection = connection
        ).count()


        data = {
            'messages': serialized_message.data,
            'next': page + 1 if messages_count > (page + 1) * page_size else None,
            'friend': serailized_friend.data
        }
    
        # send the data back (recipient)
        self.send_group(user.username, 'message.list', data)


    def receive_message_send(self, data):
        user = self.scope['user']
        connectionId = data.get('connectionId')
        message_text = data.get('message')
        media_data = data.get('media')  # Base64 encoded media
        filename = data.get('filename')  # Media filename
    
        try:
            connection = Connection.objects.get(id=connectionId)
        except Connection.DoesNotExist:
            print('error connection does not exist')
            return
    
        # Create new message
        message = Message.objects.create(
            connection=connection,
            user=user,
            text=message_text,
            is_deleted=False
        )
        
        # Handle media if provided
        if media_data and filename:
            try:
                media_file = ContentFile(base64.b64decode(media_data))
                message.media.save(filename, media_file, save=True)
                print(f'Media saved: {filename}')
            except Exception as e:
                print(f'Error saving media: {str(e)}')

        # Get recipient friend
        recipient = connection.sender
        if connection.sender == user:
            recipient = connection.receiver

        # Send new message back to sender
        serialized_message = MessageSerializer(
            message,
            context={'user': user}
        )
        serialized_friend = UserSerializer(recipient)
        sender_data = {
            'message': serialized_message.data,
            'friend': serialized_friend.data
        }
        self.send_group(user.username, 'message.send', sender_data)

        # Send new message to receiver (only if different from sender)
        if recipient.username != user.username:
            serialized_message = MessageSerializer(
                message,
                context={'user': recipient}
            )
            serialized_friend = UserSerializer(user)
            receiver_data = {
                'message': serialized_message.data,
                'friend': serialized_friend.data
            }
            self.send_group(recipient.username, 'message.send', receiver_data)


    def receive_message_type(self, data):
        user = self.scope['user']
        recipient_username = data.get('username')

        data = {
            'username': user.username
        }
        self.send_group(recipient_username, 'message.type', data)

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

        # Annotate connection with latest message data
        latest_message = Message.objects.filter(
            connection=connection
        ).order_by('-created')[:1]
        
        connection.latest_text = latest_message.values_list('text', flat=True).first() if latest_message.exists() else None
        connection.latest_created = latest_message.values_list('created', flat=True).first() if latest_message.exists() else connection.updated

        # Send new friend object to sender
        serailized_friend = FriendSerializer(
            connection,
            context = {
                'user': connection.sender
            }
        )
        self.send_group(
            connection.sender.username, 'friend.new', serailized_friend.data
        )

        # Send new friend object to receiver
        serailized_friend = FriendSerializer(
            connection,
            context = {
                'user': connection.receiver
            }
        )
        self.send_group(
            connection.receiver.username, 'friend.new', serailized_friend.data
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
        try:
            response = {
                'type': 'broadcast_group',
                'source': source,
                'data': data
            }

            # Send data to the group
            async_to_sync(self.channel_layer.group_send)(
                group, response
            )
        except Exception as e:
            print(f'ERROR in send_group: {str(e)}')
            import traceback
            traceback.print_exc()

    def receive_message_read(self, data):
        """Handle message read receipt"""
        user = self.scope['user']
        messageId = data.get('messageId')

        try:
            message = Message.objects.get(id=messageId)
        except Message.DoesNotExist:
            print(f'error message does not exist: {messageId}')
            return

        # Add current user to read_by if not already there
        if user not in message.read_by.all():
            message.read_by.add(user)
            message.status = 'read'
            message.save()

        # Get the other user in the conversation
        connection = message.connection
        recipient = connection.sender if connection.sender != user else connection.receiver

        # Send updated message to both sender and receiver
        serialized_message = MessageSerializer(
            message,
            context={'user': user}
        )
        
        read_data = {
            'message': serialized_message.data,
            'read_by_user': user.username
        }

        # Send to sender
        self.send_group(user.username, 'message.read', read_data)
        
        # Send to recipient
        self.send_group(recipient.username, 'message.read', read_data)

    def receive_message_delete(self, data):
        """Handle message deletion"""
        user = self.scope['user']
        messageId = data.get('messageId')

        try:
            message = Message.objects.get(id=messageId)
        except Message.DoesNotExist:
            print(f'error message does not exist: {messageId}')
            return

        # Verify the current user is the sender
        if message.user != user:
            print(f'error user {user.username} is not the sender of message {messageId}')
            return

        # Mark message as deleted
        message.is_deleted = True
        message.deleted_at = timezone.now()
        message.save()

        # Get the other user in the conversation
        connection = message.connection
        recipient = connection.sender if connection.sender != user else connection.receiver

        # Send updated message to both sender and receiver
        serialized_message = MessageSerializer(
            message,
            context={'user': user}
        )
        
        delete_data = {
            'message': serialized_message.data,
            'deleted_by_user': user.username
        }

        # Send to sender
        self.send_group(user.username, 'message.delete', delete_data)
        
        # Send to recipient
        self.send_group(recipient.username, 'message.delete', delete_data)

    def receive_message_edit(self, data):
        """Handle message editing"""
        user = self.scope['user']
        messageId = data.get('messageId')
        new_text = data.get('text')
        media_data = data.get('media')  # Base64 encoded media
        filename = data.get('filename')  # Media filename

        try:
            message = Message.objects.get(id=messageId)
        except Message.DoesNotExist:
            print(f'error message does not exist: {messageId}')
            return

        # Verify the current user is the sender
        if message.user != user:
            print(f'error user {user.username} is not the sender of message {messageId}')
            return

        # Update message text
        if new_text:
            message.text = new_text
        
        # Handle media update if provided
        if media_data and filename:
            try:
                # Delete old media if exists
                if message.media:
                    message.media.delete(save=False)
                
                # Save new media
                media_file = ContentFile(base64.b64decode(media_data))
                message.media.save(filename, media_file, save=False)
                print(f'Media updated: {filename}')
            except Exception as e:
                print(f'Error updating media: {str(e)}')

        # Mark as edited
        message.edited_at = timezone.now()
        message.save()

        # Get the other user in the conversation
        connection = message.connection
        recipient = connection.sender if connection.sender != user else connection.receiver

        # Send updated message to both sender and receiver
        serialized_message = MessageSerializer(
            message,
            context={'user': user}
        )
        
        edit_data = {
            'message': serialized_message.data,
            'edited_by_user': user.username
        }

        # Send to sender
        self.send_group(user.username, 'message.edit', edit_data)
        
        # Send to recipient (if different)
        if recipient.username != user.username:
            serialized_message = MessageSerializer(
                message,
                context={'user': recipient}
            )
            edit_data = {
                'message': serialized_message.data,
                'edited_by_user': user.username
            }
            self.send_group(recipient.username, 'message.edit', edit_data)

    # Calling this response will call the function name `broadcast_group`
    def broadcast_group(self, event):
        '''
        event:
            type: 'broadcast_group'
            source: where it is originated from
            data: the data that is being sent as dict
        '''
        try:
            # Extract source and data from the event (type is already handled by Channels)
            source = event.get('source')
            data_payload = event.get('data')

            '''
            Return event:
                source: where it is originated from
                data: the data that is being sent as dict
            '''
            # Send the data back to the WebSocket
            response_data = {
                'source': source,
                'data': data_payload
            }
            
            print(f'broadcast_group sending: {json.dumps(response_data)}')
            self.send(text_data=json.dumps(response_data))
        except Exception as e:
            print(f'ERROR in broadcast_group: {str(e)}')
            import traceback
            traceback.print_exc()