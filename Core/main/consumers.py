import logging
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        print("Connection attempt started")
        user = self.scope['user']
        if not user.is_authenticated:
            return
        self.username = user.username

        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )
        self.accept()


    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_add)(
            self.username, self.channel_name
        )
        print(f"Disconnected with code: {close_code}")

