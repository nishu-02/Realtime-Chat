#rules for the djangorestframework for the values

from rest_framework import serializers
from .models import User, Connection, Message

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'password'
        ]
        extra_kwargs = {
            'password':{
                'write_only': True
            }
        }
    def create( self , validated_data):
        username = validated_data['username'].lower()
        first_name = validated_data['first_name'].lower()
        last_name = validated_data['last_name'].lower()
        user = User.objects.create(
                username=username,
                first_name=first_name,
                last_name=last_name,
        )
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    name= serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'username',
            'name',
            'thumbnail'
        ]

    def get_name(self,obj):
        fname = obj.first_name.capitalize()
        lname = obj.last_name.capitalize()
        return fname + ' ' + lname
        

class SearchSerializer(UserSerializer):
    status = serializers.SerializerMethodField()

    class Meta:
        model =  User
        fields = [
            'username',
            'name',
             'thumbnail',
             'status'
        ]

    def get_status(self, obj):
        if obj.pending_them:
             return 'pending-them'
        elif obj.pending_me:
             return 'pending-me'
        elif obj.connected:
             return 'connected'
        return 'no-connection'

class RequestSerializer(serializers.ModelSerializer):
	sender = UserSerializer()
	receiver = UserSerializer()

	class Meta:
		model = Connection
		fields = [
			'id',
			'sender',
			'receiver',
			'created'
		]

class FriendSerializer(serializers.ModelSerializer):
    friend = serializers.SerializerMethodField()
    preview = serializers.SerializerMethodField()
    updated = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = [
            'id',
            'friend',
            'preview',
            'updated'
        ]

    def get_friend(self, obj):
        # IF i am the sender
        if self.context['user'] == obj.sender:
            return UserSerializer(obj.receiver).data
        # IF i am the receiver
        elif self.context['user'] == obj.receiver:
            return UserSerializer(obj.sender).data
        else:
            print('Error')

    def get_preview(self, obj):
        default = 'New Connection'
        if not hasattr(obj, 'latest_text'):
            return default
        return obj.latest_text or default

    def get_updated(self, obj):
        if not hasattr(obj, 'latest_created'):
            date = obj.updated
        else:
            date = obj.latest_created or obj.updated
        return date.isoformat()

class MessageSerializer(serializers.ModelSerializer):
    is_me = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields= [
            'id',
            'is_me',
            'text',
            'created'
        ]
    
    def get_is_me(self, obj):
        return self.context['user'] == obj.user        # if not hasattr(obj, 'latest_text'):
