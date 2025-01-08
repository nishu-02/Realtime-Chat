from django.urls import path
from . import consumers  # Assuming your consumer is ChatConsumer

websocket_urlpatterns = [
    path('ws/chat/', consumers.ChatConsumer.as_asgi()),
]
