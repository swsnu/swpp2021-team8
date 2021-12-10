from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Notification(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='_notifications')
    content = models.CharField(max_length=200, default="")
    created_at = models.DateTimeField(auto_now_add=True)