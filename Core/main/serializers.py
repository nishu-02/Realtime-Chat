#rules for the djangorestframework for the values

from rest_framework import serializers
from .models import User

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