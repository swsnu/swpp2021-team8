from django.db.utils import IntegrityError
from django.db.models.query import EmptyQuerySet
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest
from django.http.response import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.views.decorators import csrf
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import json
from json.decoder import JSONDecodeError, JSONDecoder
from django.core.exceptions import ObjectDoesNotExist

#token/ : Token
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

# user/: Get user's login status
def user(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            return JsonResponse({ "isLoggedIn": True }, status=200)
        else:
            return JsonResponse({ "isLoggedIn": False }, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])

#signup/ : User Sign Up
@ensure_csrf_cookie
@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
            username = req_data['username']

            User.objects.create_user(username, email, password)
            return HttpResponse(status=201)

        except (KeyError, JSONDecodeError) as e:
            return HttpResponse(status=400)

        except (IntegrityError) as e:
            return HttpResponse(status=409)


    else:
        return HttpResponseNotAllowed(['POST'])


#login/ : User Log In
@ensure_csrf_cookie
@csrf_exempt
def login(request):
    if request.method=='POST' :
        try:
            req_data = json.loads(request.body.decode())
            email = req_data['email']
            password = req_data['password']
            
            user = User.objects.get(email = email)

            if user.check_password(password) == False:
                return HttpResponse(status=401)

            auth_login(request, user)

            return HttpResponse(status=204)

        except (KeyError, JSONDecodeError) as e:
            return HttpResponse(status=400)

        except (User.DoesNotExist) as e:
            return HttpResponse(status=401)
        
    else:
        return HttpResponseNotAllowed(['POST'])

#logout/ : User Log Out
def logout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            auth_logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])