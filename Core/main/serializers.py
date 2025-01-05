#rules for the djangorestframework for the values

from rest_framework import serializers
from .models import User

# return the data mentioned in the json format
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'thumbnail')