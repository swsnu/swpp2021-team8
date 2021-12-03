from django.urls import path
from . import views

urlpatterns = [
    # Ott
    path('<slug:ott_plan>/', views.ott_detail),
    path('', views.ott_list),
]
