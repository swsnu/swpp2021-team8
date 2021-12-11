from django.db import models
from django.contrib.auth.models import User


# Create your models here.

class Genre(models.Model):
    name = models.CharField(max_length=20, default="")

    def __str__(self):
        return self.name
class Actor(models.Model):
    name = models.CharField(max_length = 50, default="")

    def __str__(self):
        return self.name
class Content(models.Model):
    title = models.CharField(max_length=100, default="")
    genres = models.ManyToManyField(
        Genre,
        blank=True
    )
    poster = models.CharField(default="", max_length=200)
    overview = models.TextField(default="")
    release_date = models.CharField(default="", max_length=15)
    rate = models.DecimalField(default=0, max_digits=4, decimal_places=1)
    cast = models.ManyToManyField(
        Actor,
        blank= True
    )
    director = models.CharField(max_length=100, default="")
    ott = models.CharField(max_length=200, default="")
    favorite_cnt = models.IntegerField(default=0)
    favorite_users = models.ManyToManyField(
        User,
        blank=True,
        related_name='favorite_contents'
    )

    def __str__(self):
        content_id = str(self.id)
        return content_id

class Similarity(models.Model):
    matrix = models.BinaryField()