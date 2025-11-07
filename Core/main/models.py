from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone

def upload_thumbnail(instance, filename):
    path = f'thumbanils/{instance.username}'
    extension = filename.split('.')[-1] # get file extension beacuse user might upload in the jpeg or png format
    if extension:
        path = path + '.' + extension 
    return path 

def upload_media(instance, filename):
    path = f'media/{instance.connection.id}'
    return path
    
class User(AbstractUser):
    thumbnail = models.ImageField(
        upload_to=upload_thumbnail,
        null=True,
        blank=True
    )
    last_active = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-last_active']

class Connection(models.Model):
	sender = models.ForeignKey(
		User,
		related_name='sent_connections',
		on_delete=models.CASCADE
	)
	receiver = models.ForeignKey(
		User,
		related_name='received_connections',
		on_delete=models.CASCADE
	)
	accepted = models.BooleanField(default=False)
	updated = models.DateTimeField(auto_now=True)
	created = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.sender.username + ' -> ' + self.receiver.username
      

class Message(models.Model):
    # Message status choices
    STATUS_CHOICES = [
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('read', 'Read'),
    ]

    connection = models.ForeignKey(
        Connection,
        related_name='messages',
        on_delete=models.CASCADE
	)
    user = models.ForeignKey(
        User,
        related_name='my_messages',
        on_delete=models.CASCADE
	)
    text = models.TextField()
    media = models.FileField(
        upload_to=upload_media,
        null=True,
        blank=True
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default='sent'
    )
    read_by = models.ManyToManyField(
        User,
        related_name='read_messages',
        blank=True
    )
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    edited_at = models.DateTimeField(null=True, blank=True)
    created = models.DateTimeField(auto_now_add=True)
      
    def __str__(self):
	    return self.user.username + ' -> ' + self.text