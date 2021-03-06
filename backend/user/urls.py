from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout),
    path('', views.user, name="login_status"),
]
