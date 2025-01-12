#rules for the djangorestframework for the values

from rest_framework import serializers
from .models import User, Connection

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'password']
        
        # Making the password during a request in any condition
        extra_kwargs = {
            # Ensures that when serializing, this field will be excluded
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # Clean all values, set as lowercase
        username = validated_data['username'].lower()
        first_name = validated_data['first_name'].lower()
        last_name = validated_data['last_name'].lower()

        # Create a new user
        user = User.objects.create(
            username = username,
            first_name = first_name,
            last_name = last_name,
        )
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user

# return the data mentioned in the json format
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ('username', 'name', 'thumbnail')

    def get_name(self, obj): #the object passed to it
        fname = obj.first_name.capitalize()
        lname = obj.last_name.capitalize()
        return fname + ' ' + lname
    
#subclassing the user so that we have that info
class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'username',
            'name',
            'thumbnail',
            'status',
        ]

    def get_status(self, obj):
        return 'no-connection'
    
class RequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer()
    receiver = UserSerializer()

    class Meta:
        model = Connection 
        field = [
            'id',
            'sender',
            'receiver',
            'created'
        ]