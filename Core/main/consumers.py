import logging
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print("Connection attempt started")
    
        # Get username from query parameters
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)

        # Extract username
        username = query_params.get('username', [None])[0]
        
        if not username:
            # If no username is provided, close the connection
            print("No username provided in connection")
            self.close()
            return

        # Save username to use as a group name for this user
        self.username = username

        # Join this user to a group with their username
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )

        # Accept the WebSocket connection
        self.accept()
        print(f"WebSocket connection accepted for user: {self.username}")


    def disconnect(self, close_code):
        # Remove from user-specific group
        try:
            async_to_sync(self.channel_layer.group_discard)(
                self.username,
                self.channel_name
            )
            logger.info(f"User {self.username} disconnected with code: {close_code}")
        except Exception as e:
            logger.error(f"Error removing user from group: {str(e)}")
        
    # def receive(self, text_data):
    #     """Handle received messages"""
    #     try:
    #         # Here you can add your message handling logic
    #         logger.info(f"Received message from {self.username}: {text_data}")
            
    #         # Example of broadcasting to user's group
    #         async_to_sync(self.channel_layer.group_send)(
    #             self.username,
    #             {
    #                 'type': 'chat.message',
    #                 'message': text_data
    #             }
    #         )
    #     except Exception as e:
    #         logger.error(f"Error processing message: {str(e)}")

    # def chat_message(self, event):
    #     """Handle chat messages"""
    #     try:
    #         # Send message to WebSocket
    #         self.send(text_data=event['message'])
    #     except Exception as e:
    #         logger.error(f"Error sending message: {str(e)}")