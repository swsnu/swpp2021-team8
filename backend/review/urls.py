from django.urls import path
from . import views

urlpatterns = [
    path('<int:review_id>/', views.review_detail)
]
