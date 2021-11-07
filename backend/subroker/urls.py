from django.urls import path
from subroker import views

urlpatterns = [
    #User
    path('user/', views.user, name="login_status"),
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout),
]