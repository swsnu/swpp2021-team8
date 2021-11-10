from django.contrib import admin

# Register your models here.
from .models import Ott, Group, Content, Review

admin.site.register(Ott)
admin.site.register(Group)
admin.site.register(Content)
admin.site.register(Review)

