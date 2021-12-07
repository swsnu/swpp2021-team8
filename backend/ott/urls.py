from django.urls import path
from . import views

urlpatterns = [
    # Ott
    path('initialize/', views.initialize_ott),
    path('<slug:ott_plan>/', views.ott_detail),
    path('', views.ott_list),
]
