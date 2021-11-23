# Register your models here.
from django.contrib import admin
from .models import Ott, Group, Content, Review

admin.site.register(Ott)
admin.site.register(Group)
admin.site.register(Content)
admin.site.register(Review)
