from django.urls import path
from subroker import views

urlpatterns = [
    #User
    path('user/', views.user, name="login_status"),
    path('signup/', views.signup, name='signup'),
    path('token/', views.token, name='token'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout),

    #Group
    path('group/', views.group_list),
    path('group/<int:group_id>/', views.group_detail),
    path('group/<int:group_id>/user/', views.group_add_user),

    #Content
    path('content/', views.content_list),
    path('content/search/<str:search_str>/', views.content_search),
    path('content/<int:content_id>/', views.content_detail),
    path('content/<int:user_id>/recommendation/', views.content_recommendation),
    path('content/trending/', views.content_trending),
    path('content/<int:user_id>/favorite/', views.user_favorite_list),
    path('content/<int:user_id>/favorite/<int:content_id>/', views.content_favorite),

    #Review
    path('content/<int:content_id>/review/', views.review_content),
    path('review/<int:review_id>/', views.review_detail)

]