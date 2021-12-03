from django.db import models
from django.contrib.auth.models import User
from content.models import Content

# Create your models here.


class Review(models.Model):
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name='content_reviews'
    )
    detail = models.TextField(default="")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_reviews'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.detail
