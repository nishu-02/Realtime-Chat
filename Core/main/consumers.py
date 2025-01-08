from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    
    def connect(self):
        user = self.scope['user'] # extracting the user
        print(user)
        
        if user.is_authenticated:
                return
        self.accept()

    def disconnect(self, close_code):
        pass

# it will pass the tokens that will be easy