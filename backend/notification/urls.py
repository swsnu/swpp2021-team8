from django.urls import path
from . import views

urlpatterns = [
    path('', views.handle_notification, name="handle_notification"),
]
