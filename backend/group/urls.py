from django.urls import path
from . import views

urlpatterns = [
    path('<int:group_id>/user/', views.group_add_user),
    path('<int:group_id>/', views.group_detail),
    path('', views.group_list),
]
