"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

# Import necessary modules
import os
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
# from django_channels_jwt_auth_middleware import JWTAuthMiddlewareStack
from django.core.asgi import get_asgi_application

# Set the default Django settings module for the 'asgi' program
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Get the ASGI application for handling HTTP requests
django_asgi_app = get_asgi_application()

# Define the ASGI application protocol routing
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    # Uncomment the following lines when you're ready to implement WebSocket support
    # "websocket": AllowedHostsOriginValidator(
    #     JWTAuthMiddlewareStack(
    #         URLRouter(
    #             main.routing.websocket_urlpatterns  # Ensure this is correctly configured in the main app's routing.py
    #         )
    #     )
    # ),
})
