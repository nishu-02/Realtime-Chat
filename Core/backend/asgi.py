import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from channels.middleware import BaseMiddleware
import main.routing

# Ensure Django apps are ready
from django.apps import apps
apps.check_apps_ready()

# Create a simple middleware for handling username
class UsernameMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        # Add the query parameters to the scope
        return await super().__call__(scope, receive, send)

# Get the ASGI application
django_asgi_app = get_asgi_application()

# Set up the WebSocket routing with Username Middleware
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        UsernameMiddleware(
            URLRouter(
                main.routing.websocket_urlpatterns
            )
        )
    ),
})