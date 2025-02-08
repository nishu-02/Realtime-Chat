"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application
from django_channels_jwt_auth_middleware.auth import JWTAuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from channels.routing import ProtocolTypeRouter, URLRouter
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()
import main.routing

application = ProtocolTypeRouter ({
    'http' : django_asgi_app,
    'websocket' : AllowedHostsOriginValidator(
        JWTAuthMiddlewareStack(
            URLRouter(main.routing.websocket_urlpatterns)
        )
    )

})