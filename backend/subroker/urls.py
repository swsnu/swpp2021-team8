from django.urls import path
from subroker import views

urlpatterns = [
    #User
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout),
    path('user/favorite/', views.user_favorite_list),

    
    #Group
    path('group/', views.group_list),
    path('group/<int:group_id>/', views.group_info),
    path('group/<int:group_id>/user/', views.group_add_user),

    #Content
    path('content/', views.content_list),
    path('content/<int:content_id>/', views.content_info),
    path('content/<int:user_id>/recommendation/', views.recommendation),
    path('content/trending/', views.trending),
    path('content/<int:content_id>/favorite/', views.content_favorite),

    #Review
    path('content/<int:content_id>/review/', views.review_content),
    path('review/<int:review_id>/', views.review_info)

]