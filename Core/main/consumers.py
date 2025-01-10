from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # Get the authenticated user from the scope
        user = self.scope['user']

        # If the user is not authenticated, deny the connection
        if not user.is_authenticated:
            self.close()
            return

        # Save the username to use as a group name
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
            self.channel_name  # WebSocket channel name
        )
