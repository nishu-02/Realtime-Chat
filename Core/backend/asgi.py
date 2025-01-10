import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
# from channels.middleware import BaseMiddleware
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
import main.routing

# Ensure Django apps are ready
from django.apps import apps
apps.check_apps_ready()

# Get the ASGI application
django_asgi_app = get_asgi_application()

# Set up the WebSocket routing with Username Middleware
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter(
                main.routing.websocket_urlpatterns
            )
        )
    ),
})