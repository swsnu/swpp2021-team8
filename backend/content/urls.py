from django.urls import path
from . import views

urlpatterns = [
    path('initialize/genre/', views.initialize_genre),
    path('initialize/contents/', views.initialize_contents),
    path('trending/', views.content_trending),
    path('search/<str:search_str>/', views.content_search),
    path('<int:user_id>/recommendation/', views.content_recommendation),
    path('<int:user_id>/favorite/', views.user_favorite_list),
    path('<int:user_id>/favorite/<int:content_id>/', views.content_favorite),
    path('<int:content_id>/review/', views.review_content),
    path('<int:content_id>/', views.content_detail),
    path('<str:content_title>/ott/', views.content_ott)
]
