from django.shortcuts import render
from django.db.models.query import EmptyQuerySet
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.views.decorators import csrf
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import json
from json.decoder import JSONDecodeError
from .models import Ott, Group, Content, Review
from django.db.models import Q
import pip._vendor.requests as requests
import time

# user/: Get user's login status
@ensure_csrf_cookie
@csrf_exempt
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
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        try:
            user = User.objects.get(username = username)
        except (User.DoesNotExist) as e:
            User.objects.create_user(username=username, email=None, password=password)
            return HttpResponse(status=201)
        #ERR 409 : Username Already Exists
        return HttpResponse(status=409)
    else:
        #ERR 405 : METHOD NOT ALLOWED
        return HttpResponseNotAllowed(['POST'])

#token/ : Token
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

#login/ : User Log In
@ensure_csrf_cookie
@csrf_exempt
def login(request):
    if request.method=='POST' :
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        try:
            user = User.objects.get(username = username)
        #ERR 401 : User Doesn't Exist
        except (User.DoesNotExist) as e:
            return HttpResponse(status=401)
        #ERR 401 : Password Doesn't Match
        if user.check_password(password) == False:
            return HttpResponse(status=401)
        auth_login(request, user)
        return HttpResponse(status=204)

    else:
        #ERR 405 : METHOD NOT ALLOWED
        return HttpResponseNotAllowed(['POST'])

#logout/ : User Log Out
def logout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            auth_logout(request)
            return HttpResponse(status=204)
        #ERR 401 : Not Authenticatedd
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

#Group
def group_list(request):    
    if request.method == 'GET':
        if request.user.is_authenticated:
            query_name = request.GET.get("name", None)
            query_ott = request.GET.getlist("ott", None)

            groups = Group.objects.all()
            group_all_list = []

            if query_name:
                groups = groups.filter(Q(name__icontains=query_name) | Q(leader__username__icontains=query_name))

            if query_ott:
                Q_ott = Q()
                for _query in query_ott:
                    [ott, membership] = _query.split('__')
                    Q_ott.add(Q(membership__ott__iexact=ott) & Q(membership__membership__iexact=membership), Q.OR)

                groups = groups.filter(Q_ott)

            # TODO
            group_all_list = [{
                'id': group.id,
                'platform': group.membership.ott,
                'membership': group.membership.membership,
                'title': group.name,
                'leader': group.leader.username,
                'price': group.membership.cost,
                'curMember': group.current_people,
                'maxMember': group.membership.max_people,
                'duration': group.payday
                }  for group in groups]

            return JsonResponse(group_all_list, safe=False, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
        
    elif request.method == 'POST':
        if request.user.is_authenticated:
            try:
                req_data = json.loads(request.body.decode())
                group_name = req_data['name']
                group_description = req_data['description']
                group_is_public = bool(req_data['is_public'])
                group_password = int(req_data['password'])
                group_payday = int(req_data['payday'])
                group_account_bank = req_data['account_bank']
                group_account_number = req_data['account_number']
                group_account_name = req_data['account_name']
                group_leader = request.user
            #ERR 400 : JSONDecodeErr
            except (JSONDecodeError, KeyError) as e:
                return HttpResponseBadRequest()
            try:
                group_membership = Ott.objects.get(id=req_data['membership'])
            #ERR 404 : Ott Doesn't Exist
            except (Ott.DoesNotExist) as e:
                return HttpResponse(status=404)
            group = Group(
                name=group_name, 
                description=group_description, 
                is_public=group_is_public, 
                password=group_password, 
                membership=group_membership, 
                payday=group_payday, 
                account_bank = group_account_bank, 
                account_number=group_account_number, 
                account_name=group_account_name, 
                leader=group_leader
                )
            group.save()
            response_dict = {'id': group.id, 'name': group.name, 'leader': group.leader.id} 
            return JsonResponse(response_dict, status=201)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def group_detail(request, group_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            #ERR 404 : Group Doesn't Exist
            except (Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            membership = Ott.objects.filter(id=group.membership.id).values()[0]
            members = [member for member in group.members.all().values()]
            leader = User.objects.filter(id=group.leader.id).values()[0]
            return JsonResponse({
                "id": group.id, 
                "name": group.name, 
                "description": group.description, 
                "is_public": group.is_public, 
                "password": group.password, 
                "created_at": group.created_at,
                "will_be_deleted": group.will_be_deleted,
                "membership": membership, 
                "payday": group.payday, 
                "account_bank": group.account_bank, 
                "account_number": group.account_number, 
                "account_name": group.account_name, 
                "leader": leader,
                "members": members,
                "current_people": group.current_people
                }, status=200)
        #ERR 401 : METHOD NOT ALLOWED
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            group_name = req_data['name']
            group_description = req_data['description']
            group_is_public = req_data['is_public']
            group_password = req_data['password']
            group_account_bank = req_data['account_bank']
            group_account_number = req_data['account_number']
            group_account_name = req_data['account_name']
            try:
                group = Group.objects.get(id=group_id)
            #ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            #ERR 403 : Not Leader
            if(group.leader != request.user):
                response_dict = {"leader": group.leader.id, "request user": request.user.id}
                return JsonResponse(response_dict, status=403)
            group.name=group_name
            group.description=group_description
            group.is_public=group_is_public
            group.password=group_password
            group.account_bank = group_account_bank
            group.account_number=group_account_number
            group.account_name=group_account_name
            group.save()
            response_dict = {
                "id": group.id, 
                "name": group.name, 
                "description": group.description, 
                "is_public": group.is_public, 
                "password": group.password, 
                "account_bank": group.account_bank, 
                "account_number": group.account_number, 
                "account_name": group.account_name, 
                "leader": group.leader.id,
                "current_people": group.current_people
            }
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            #ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            group.delete()
            return HttpResponse(status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

def group_add_user(request, group_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            new_member = request.user
            try:
                group = Group.objects.get(id=group_id)
            #ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            #ERR 400 : Group Is Full
            if(group.current_people >= group.membership.max_people):
                return HttpResponseBadRequest()
            group.members.add(new_member)
            group.current_people = group.current_people+1
            group.save()
            members = [member for member in group.members.all().values()]
            response_dict = {
                "id": group.id, 
                "members": members,
                "current_people": group.current_people
            }
            return JsonResponse(response_dict, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            #ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            group.members.remove(request.user)
            group.current_people= group.current_people-1
            members = [member for member in group.members.all().values()]
            response_dict = {
                "id": group.id, 
                "members": members,
                "current_people": group.current_people
            }
            return JsonResponse(response_dict, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])

#Content
def content_list(request, content_id):
    return HttpResponse("content search")

#search from the-movie-db by search string
def content_search(request, search_str):
    if request.method == 'GET':
        # keep track of how many times we've retried
        MAX_RETRIES = 2
        attempt_num = 0  
        while attempt_num < MAX_RETRIES:
            url = 'https://api.themoviedb.org/3/search/movie'
            params={'api_key':'e50a928b29c2b7ed1f82ba2e6ce4982c','query':search_str.replace(" ","+")}
            r = requests.get(url, params = params)
            if r.status_code == 200:
                data = r.json()
                return JsonResponse(data, status=200)
            else:
                attempt_num += 1
                # Wait for 5 seconds before re-trying
                time.sleep(5)  
        return HttpResponse(status=405)
    else:
        return HttpResponseNotAllowed(['GET'])

def content_detail(request, content_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            # keep track of how many times we've retried
            MAX_RETRIES = 2
            attempt_num = 0  

            #get content from TMDB
            while attempt_num < MAX_RETRIES:
                url = 'https://api.themoviedb.org/3/movie/' + str(content_id)
                params={'api_key':'e50a928b29c2b7ed1f82ba2e6ce4982c'}
                r = requests.get(url, params = params)
                #got content from TMDB
                if r.status_code == 200:
                    data = r.json()
                    id = data['id']
                    name = data['title']
                    genres = []
                    for genre in data['genres']:
                        genres.append(genre['name'])
                    poster = data['poster_path']
                    overview = data['overview']
                    release_date = data['release_date']
                    #check if the content is in DB
                    try:
                        content = Content.objects.get(id=content_id)
                    #Content is not in our DB
                    except(Content.DoesNotExist) as e:
                        create_url = 'http://localhost:8000/api/content/' +  str(content_id) + '/'
                        r = requests.post(create_url, headers=request.headers)
                        return JsonResponse({
                        "id": id,
                        "name": name,
                        "genre": genres,
                        "poster": 'https://image.tmdb.org/t/p/original/' + poster,
                        "description": overview,
                        "release_date": release_date,
                        "favorite_users": [],
                        "favorite_cnt": 0
                        }, status=200)
                    #Content is in our DB
                    favorite_users = [user for user in content.favorite_users.all().values()]
                    favorite_cnt = content.favorite_cnt
                    return JsonResponse({
                        "id": id,
                        "name": name,
                        "genre": genres,
                        "poster": 'https://image.tmdb.org/t/p/original/' + poster,
                        "description": overview,
                        "release_date": release_date,
                        "favorite_users": favorite_users,
                        "favorite_cnt": favorite_cnt
                        }, status=200)
                else:
                    attempt_num += 1
                    # Wait for 5 seconds before re-trying
                    time.sleep(5)  
            return HttpResponse(status=405)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'POST':
        if request.user.is_authenticated:
            favorite_users = []
            favorite_cnt = 0

            content = Content(
                id=content_id,
                favorite_cnt=favorite_cnt
            )
            content.favorite_users.set(favorite_users),
            content.save()
            response_dict = {'id': content.id} 
            return JsonResponse(response_dict, status=201)
        else:
            HttpResponse(status=403)

    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def content_recommendation(request, user_id):
    return HttpResponse("recommendation")

def user_favorite_list(request, user_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                user = User.objects.get(id=user_id)
            #ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as e:
                return HttpResponse(status=404)
            fav_contents = [content for content in user.favorite_contents.all().values()]
            #ERR 400 : Fav Content Doesn't Exist
            if not fav_contents:
                return HttpResponse(status=400)
            return JsonResponse(fav_contents, safe=False, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET'])

def content_favorite(request, user_id, content_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            try:
                new_user = User.objects.get(id=user_id)
            #ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as e:
                return HttpResponse(status=404)
            #ERR 400 : Content Doesn't Exist
            try:
                content = Content.objects.get(id=content_id)
            except(Content.DoesNotExist) as e:
                return HttpResponse(status=400)
            content.favorite_users.add(new_user)
            content.favorite_cnt = content.favorite_cnt +1
            content.save()
            fav_users = [user for user in content.favorite_users.all().values()]
            response_dict = {
                "id": content.id, 
                "favorite_users": fav_users,
                "favorite_cnt": content.favorite_cnt
            }
            return JsonResponse(response_dict, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                user = User.objects.get(id=user_id)
            #ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as e:
                return HttpResponse(status=404)
            try:
                content = Content.objects.get(id=content_id)
            #ERR 400 : Content Doesn't Exist
            except(Content.DoesNotExist) as e:
                return HttpResponse(status=400)
            content.favorite_users.remove(request.user)
            content.favorite_cnt = content.favorite_cnt -1
            return HttpResponse(status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    #ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])

def content_trending(request):
    return HttpResponse("trending")

#Review
def review_content(request, content_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                content = Content.objects.get(id=content_id)
            #ERR 404 : Content Doesn't Exist
            except(Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            reviews = [review for review in content.content_reviews.all().values()]
            #ERR 400 : Review Doesn't Exist
            if not reviews:
                return HttpResponse(status=400)
            return JsonResponse(reviews, safe=False, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    elif request.method == 'POST':
        if request.user.is_authenticated:
            try:
                req_data = json.loads(request.body.decode())
                review_detail = req_data['detail']
                review_user = request.user
            #ERR 400 : KeyErr, JSONDecodeErr
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
            try:
                review_content = Content.objects.get(id=content_id)
            #ERR 404 : Content Doesn't Exist
            except (Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            review = Review(content=review_content, detail=review_detail, user=review_user)
            review.save()
            response_dict = {'id': review.id, 'content': review.content.id, 'detail': review.detail, 'user':review.user.id, 'created_at': review.created_at}
            return JsonResponse(response_dict, status=201)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def review_detail(request, review_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            #ERR 404 : Review Doesn't Exist
            except (Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            response_dict = {"id": review.id, "content_id": review.content.id, "detail": review.detail, "user": review.user.id, "created_at": review.created_at}
            return JsonResponse(response_dict, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            review_detail = req_data['detail']
            try:
                review = Review.objects.get(id=review_id)
            #ERR 404 : Review Doesn't Exist
            except(Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            #ERR 403 : Not Author
            if(review.user != request.user):
                return HttpResponse(status=403)
            review.detail = review_detail
            review.save()
            response_dict = {"id": review.id, "content_id": review.content.id, "detail": review.detail, "user_id": review.user.id}
            return JsonResponse(response_dict, status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            #ERR 404 : Review Doesn't Exist
            except(Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            review.delete()
            return HttpResponse(status=200)
        #ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
        
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
