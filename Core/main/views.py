from django.contrib.auth import authenticate
from django.shortcuts import render
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken  # allows to manually create the tokens(user)
from .serializers import UserSerializer, SignUpSerializer
import logging
logger = logging.getLogger(__name__)

def get_auth_for_user(user):
    tokens = RefreshToken.for_user(user)
    # print('token', type(tokens), tokens)
    return {
        'user': UserSerializer(user).data, #pass the data to the serializer
        'tokens' : {
            'access': str(tokens.access_token),
            'refresh': str(tokens),
         }    
    } #getting the tokens for the custom authentication

class SignInView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print("Received data:", request.data)  # For debugging
        username = request.data.get('username')
        password = request.data.get('password')

        logger.debug(request.data)  # Log the request data
    
        if not username or not password:
            return Response({'error': 'username or password is required'}, status=400)
    
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({'error': 'invalid username or password'}, status=401)
    
        user_data = get_auth_for_user(user)
        return Response(user_data)


    
class SignUpView(APIView):
    persmission_classes = [AllowAny]

    def post(self, request):
        new_user = SignUpSerializer(data = request.data)
        new_user.is_valid(raise_exception=True)
        user = new_user.save()

        user_data= get_auth_for_user(user)

        return Response(user_data)
    