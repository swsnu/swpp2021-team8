from django.contrib import admin
from content.models import Content, Genre, Actor, Similarity

# Register your models here.
admin.site.register(Content)
admin.site.register(Genre)
admin.site.register(Actor)
admin.site.register(Similarity)
