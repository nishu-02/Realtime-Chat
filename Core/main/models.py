from django.contrib.auth.models import AbstractUser
from django.db import models

def upload_thumbnail(instance, filename):
    path = f'thumbanils/{instance.username}'
    extension = filename.split('.')[-1] # get file extension beacuse user might upload in the jpeg or png format
    if extension:
        path = path + '.' + extension 
    return path 
    
class User(AbstractUser):
    thumbnail = models.ImageField(
        upload_to=upload_thumbnail,
        null=True,
        blank=True
    )