from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class Content(models.Model):
    favorite_cnt = models.IntegerField(default=0)
    favorite_users = models.ManyToManyField(
        User,
        blank=True,
        related_name='favorite_contents'
    )

    def __str__(self):
        content_id = str(self.id)
        return content_id
