import json
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout as auth_logout
from deco import require_http_methods, login_required

@ensure_csrf_cookie
@require_http_methods(['GET'])
def token(request):
    """
    /api/user/token/

    GET
        Publish CSRF token
    """
    if request.method == 'GET':
        return HttpResponse(status=204)

@ensure_csrf_cookie
@require_http_methods(['GET'])
def user(request):
    """
    /api/user/

    GET
        Get User's current loginStatus and information
    """
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = User.objects.prefetch_related('group_leader', 'user_groups').get(id=request.user.id)

            not_deleted_group_count = user.group_leader.filter(will_be_deleted=False).count() + user.user_groups.filter(will_be_deleted=False).count()
            deleted_group_count = user.group_leader.filter(will_be_deleted=True).count() + user.user_groups.filter(will_be_deleted=True).count()

            return JsonResponse({"id": request.user.id, "username": request.user.username, "isLoggedIn": True ,"notDeletedGroupCount" : not_deleted_group_count, "deletedGroupCount": deleted_group_count}, status=200)
        else:
            return JsonResponse({"id": "", "username": "","isLoggedIn": False, "notDeletedGroupCount" : 0, "deletedGroupCount": 0}, status=200)

@require_http_methods(['POST'])
def signup(request):
    """
    /api/user/signup/

    POST
        Make a new user
    """
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        try:
            User.objects.get(username=username)
        except (User.DoesNotExist) as _:
            User.objects.create_user(
                username=username, email=None, password=password)
            return HttpResponse(status=201)
        # ERR 409 : Username Already Exists
        return HttpResponse(status=409)

@require_http_methods(['POST'])
def login(request):
    """
    /api/user/login/

    POST
        Login if user info is valid
    """
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        try:
            user = User.objects.get(username=username)
        # ERR 401 : User Doesn't Exist
        except (User.DoesNotExist) as _:
            return HttpResponse(status=401)
        # ERR 401 : Password Doesn't Match
        if not user.check_password(password):
            return HttpResponse(status=401)

        auth_login(request, user)
        return HttpResponse(status=204)

@require_http_methods(['GET'])
@login_required
def logout(request):
    """
    /api/user/logout/

    GET
        Logout user
    """
    if request.method == 'GET':
        auth_logout(request)
        return HttpResponse(status=204)