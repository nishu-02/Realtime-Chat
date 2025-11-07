#rules for the djangorestframework for the values

from rest_framework import serializers
from .models import User, Connection, Message

class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'username',
            'email',
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
        email = validated_data.get('email', '').lower()
        first_name = validated_data['first_name'].lower()
        last_name = validated_data['last_name'].lower()
        user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
        )
        password = validated_data['password']
        user.set_password(password)
        user.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = [
            'username',
            'name',
            'email',
            'thumbnail',
            'date_joined'
        ]

    def get_name(self, obj):
        fname = obj.first_name.capitalize() if obj.first_name else ''
        lname = obj.last_name.capitalize() if obj.last_name else ''
        name = (fname + ' ' + lname).strip()
        return name if name else obj.username
        

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
    is_read = serializers.SerializerMethodField()
    read_count = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields= [
            'id',
            'is_me',
            'text',
            'media',
            'status',
            'is_deleted',
            'is_read',
            'read_count',
            'created'
        ]
    
    def get_is_me(self, obj):
        return self.context['user'] == obj.user

    def get_is_read(self, obj):
        return self.context['user'] in obj.read_by.all()

    def get_read_count(self, obj):
        return obj.read_by.count()
