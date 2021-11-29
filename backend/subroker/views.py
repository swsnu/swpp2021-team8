import json
import time
import random
from json.decoder import JSONDecodeError
import requests
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.db.models import Q
from django.conf import settings
from .models import Ott, Group, Content, Review



# Request the movie api with url and params
# _params should be dictionary type
def request_the_movie_api(url, _params):
    MAX_RETRIES = 2
    SLEEP_TIME = 5
    attempt_num = 0
    params = {'api_key': settings.THE_MOVIE_API_KEY}
    params.update(_params)

    while attempt_num < MAX_RETRIES:
        r = requests.get(url, params=params)
        if r.status_code == 200:
            return r.json()
        else:
            attempt_num += 1
            time.sleep(SLEEP_TIME)

    return None

# user/: Get user's login status
@ensure_csrf_cookie
@csrf_exempt
def user(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            user = User.objects.get(id=request.user.id)

            not_deleted_group_count = user.group_leader.filter(will_be_deleted=False).count() + user.user_groups.filter(will_be_deleted=False).count()
            deleted_group_count = user.group_leader.filter(will_be_deleted=True).count() + user.user_groups.filter(will_be_deleted=True).count()

            return JsonResponse({"id": request.user.id, "username": request.user.username, "isLoggedIn": True ,"notDeletedGroupCount" : not_deleted_group_count, "deletedGroupCount": deleted_group_count}, status=200)
        else:
            return JsonResponse({"id": "", "username": "","isLoggedIn": False, "notDeletedGroupCount" : 0, "deletedGroupCount": 0}, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])

# signup/ : User Sign Up


@ensure_csrf_cookie
@csrf_exempt
def signup(request):
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
    else:
        # ERR 405 : METHOD NOT ALLOWED
        return HttpResponseNotAllowed(['POST'])

# token/ : Token


@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

# login/ : User Log In


@ensure_csrf_cookie
@csrf_exempt
def login(request):
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

    else:
        # ERR 405 : METHOD NOT ALLOWED
        return HttpResponseNotAllowed(['POST'])

# logout/ : User Log Out
def logout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            auth_logout(request)
            return HttpResponse(status=204)
        # ERR 401 : Not Authenticatedd
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

# Group
def group_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            query_name = request.GET.get("name", None)
            query_ott = request.GET.getlist("ott", None)

            groups = Group.objects.all()
            group_all_list = []

            if query_name:
                groups = groups.filter(Q(name__icontains=query_name) | Q(
                    leader__username__icontains=query_name))

            if query_ott:
                q_ott = Q()
                for _query in query_ott:
                    [ott, membership] = _query.split('__')
                    q_ott.add(Q(membership__ott__iexact=ott) & Q(
                        membership__membership__iexact=membership), Q.OR)

                groups = groups.filter(q_ott)

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
            } for group in groups]

            return JsonResponse(group_all_list, safe=False, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'POST':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            group_name = req_data['name']
            group_description = req_data['description']
            group_is_public = bool(req_data['isPublic'])
            group_password = int(req_data['password'])
            group_payday = int(req_data['payday'])
            group_account_bank = req_data['accountBank']
            group_account_number = req_data['accountNumber']
            group_account_name = req_data['accountName']
            try:
                group_ott_plan = Ott.objects.get(id=req_data['ottPlanId'])
            # ERR 404 : Ott Doesn't Exist
            except (Ott.DoesNotExist) as _:
                return HttpResponse(status=404)
            group = Group(
                name=group_name,
                description=group_description,
                is_public=group_is_public,
                password=group_password,
                membership=group_ott_plan,
                payday=group_payday,
                account_bank=group_account_bank,
                account_number=group_account_number,
                account_name=group_account_name,
                leader=request.user,
            )
            group.save()
            user = User.objects.get(id=request.user.id)
            group.members.add(user.id)
            group.save()
            response_dict = {
                'id': group.id,
                'name': group.name,
                'leader': group.leader.id}
            return JsonResponse(response_dict, status=201)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def group_detail(request, group_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            # ERR 404 : Group Doesn't Exist
            except (Group.DoesNotExist) as _:
                return HttpResponse(status=404)
            leader = User.objects.filter(id=group.leader.id).values()[0]
            members = [
                {
                    "id": member.id,
                    "username": member.username,
                }
                for member in group.members.all()]
            response_dict = {
                "id": group.id,
                "name": group.name,
                "platform": group.membership.ott,
                "membership": group.membership.membership,
                "cost": group.membership.cost,
                "maxPeople": group.membership.max_people,
                "currentPeople": group.current_people,
                "members": members,
                "accountBank": group.account_bank,
                "accountNumber": group.account_number,
                "accountName": group.account_name,
                "description": group.description,
                "payday": group.payday,
                "leader": leader,
            }
            return JsonResponse(response_dict, safe=False, status=200)
        # ERR 401 : METHOD NOT ALLOWED
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            group_name = req_data['name']
            group_description = req_data['description']
            group_is_public = req_data['isPublic']
            group_password = req_data['password']
            group_account_bank = req_data['accountBank']
            group_account_number = req_data['accountNumber']
            group_account_name = req_data['accountName']
            try:
                group = Group.objects.get(id=group_id)
            # ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as _:
                return HttpResponse(status=404)
            # ERR 403 : Not Leader
            if(group.leader != request.user):
                response_dict = {"leader": group.leader.id,
                                 "request user": request.user.id}
                return JsonResponse(response_dict, status=403)
            group.name = group_name
            group.description = group_description
            group.is_public = group_is_public
            group.password = group_password
            group.account_bank = group_account_bank
            group.account_number = group_account_number
            group.account_name = group_account_name
            group.save()
            response_dict = {
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "isPublic": group.is_public,
                "password": group.password,
                "accountBank": group.account_bank,
                "accountNumber": group.account_number,
                "accountName": group.account_name,
                "leader": group.leader.id,
                "currentPeople": group.current_people,
            }
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            # ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as _:
                return HttpResponse(status=404)
            group.will_be_deleted = True
            group.save()
            # group.delete()
            response_dict = {
                "id": group.id,
                "willBeDeleted": group.will_be_deleted,
            }
            return JsonResponse(response_dict, status=200)
            # return HttpResponse(status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])


def group_add_user(request, group_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            # ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as _:
                return HttpResponse(status=404)
            # ERR 400 : Group Is Full
            # print(f"curPeo: {group.current_people}, mem: {group.members.all().values()} before add")
            if(group.current_people > group.membership.max_people):
                return HttpResponseBadRequest()
            group.members.add(request.user)
            group.current_people = group.current_people + 1
            group.save()
            members = list(group.members.all().values())
            response_dict = {
                "id": group.id,
                "members": members,
                "currentPeople": group.current_people,
            }
            return JsonResponse(response_dict, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            # ERR 404 : Group Doesn't Exist
            except(Group.DoesNotExist) as _:
                return HttpResponse(status=404)
            # print(f"curPeo: {group.current_people}, mem: {group.members.all().values()} before add")
            group.members.remove(request.user)
            group.current_people = group.current_people - 1
            group.save()
            members = list(group.members.all().values())
            response_dict = {
                "id": group.id,
                "members": members,
                "currentPeople": group.current_people,
            }
            return JsonResponse(response_dict, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])


def ott_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            otts = Ott.objects.all()
            ott_names = set([ott['ott'] for ott in otts.values()])
            ott_all_list = [{
                'name': name,
            } for name in ott_names]
            return JsonResponse(ott_all_list, safe=False, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET'])


def ott_detail(request, ott_plan):
    if request.method == 'GET':
        if request.user.is_authenticated:
            ott_platform, ott_membership = ott_plan.split('_')
            try:
                ott = Ott.objects.get(
                    ott=ott_platform.capitalize(),
                    membership=ott_membership.capitalize())
            # ERR 404 : Ott Doesn't Exist
            except (Ott.DoesNotExist) as _:
                return HttpResponse(status=404)
            response_dict = {
                'id': ott.id,
                'platform': ott.ott,
                'membership': ott.membership,
                'maxPeople': ott.max_people,
                'cost': ott.cost,
            }
            return JsonResponse(response_dict, safe=False, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET'])

# Content
def content_list(request, content_id):
    return HttpResponse("content search")

# search from the-movie-db by search string


def content_search(request, search_str):
    if request.method == 'GET':
        # keep track of how many times we've retried
        MAX_RETRIES = 2
        attempt_num = 0
        while attempt_num < MAX_RETRIES:
            url = 'https://api.themoviedb.org/3/search/movie'
            params = {
                'api_key': 'e50a928b29c2b7ed1f82ba2e6ce4982c',
                'query': search_str.replace(
                    " ",
                    "+")}
            r = requests.get(url, params=params)
            if r.status_code == 200:
                data = r.json()
                result = []
                for content in data['results']:
                    id = content['id']
                    poster = content['poster_path']
                    if poster is None:
                        poster = ""
                    title = content['title']
                    result.append({
                        "id": id,
                        "poster": 'https://image.tmdb.org/t/p/original/' + poster,
                        "title": title
                    })

                return JsonResponse(result, status=200, safe=False)
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

            # get content from TMDB
            while attempt_num < MAX_RETRIES:
                url = 'https://api.themoviedb.org/3/movie/' + str(content_id)
                params = {'api_key': 'e50a928b29c2b7ed1f82ba2e6ce4982c'}
                r = requests.get(url, params=params)
                # got content from TMDB
                if r.status_code == 200:
                    data = r.json()
                    id = data['id']
                    name = data['title']
                    genres = ",".join([genre['name']
                                       for genre in data['genres']])
                    countries = ",".join(
                        [country['name'] for country in data['production_countries']])
                    poster = data['poster_path']
                    overview = data['overview']
                    release_date = data['release_date']
                    rate = data['vote_average']
                    # check if the content is in DB
                    try:
                        content = Content.objects.get(id=content_id)
                    # Content is not in our DB
                    except(Content.DoesNotExist) as _:
                        content = Content()
                        content.id = id
                        content.save()
                        return JsonResponse({
                            "id": id,
                            "name": name,
                            "genre": genres,
                            "countries": countries,
                            "poster": 'https://image.tmdb.org/t/p/original/' + poster,
                            "description": overview,
                            "release_date": release_date,
                            "rate": rate,
                            "favorite_users": [],
                            "favorite_cnt": 0
                        }, status=200)
                    # Content is in our DB
                    favorite_users = list(content.favorite_users.all().values())
                    favorite_cnt = content.favorite_cnt
                    return JsonResponse({
                        "id": id,
                        "name": name,
                        "genre": genres,
                        "countries": countries,
                        "poster": 'https://image.tmdb.org/t/p/original/' + poster,
                        "description": overview,
                        "release_date": release_date,
                        "rate": rate,
                        "favorite_users": favorite_users,
                        "favorite_cnt": favorite_cnt
                    }, status=200)
                else:
                    attempt_num += 1
                    # Wait for 5 seconds before re-trying
                    time.sleep(5)
            return HttpResponse(status=405)
        # ERR 401 : Not Authenticated
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
            content.favorite_users.set(favorite_users)
            content.save()
            response_dict = {'id': content.id}
            return JsonResponse(response_dict, status=201)
        else:
            return HttpResponse(status=403)

    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def content_recommendation(request, user_id):
    if request.method == "GET":
        if not request.user.is_authenticated:
            # ERR 401 : Not Authenticated
            return HttpResponse(status=401)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            # ERR 404 : User Doesn't Exist
            return HttpResponse(status=404)

        fav_contents_id = [content["id"]
                           for content in user.favorite_contents.all()]
        recommendation_contents = []
        recommendation_url = 'https://api.themoviedb.org/3/movie/{0}/recommendations'
        placeholder = 'https://via.placeholder.com/150?text=No+Content'

        # If user has no favorite contents
        if not fav_contents_id:
            DEFAULT_CONTENT_ID = 68718  # Django Unchained
            url = recommendation_url.format(DEFAULT_CONTENT_ID)
            data = request_the_movie_api(url, dict())

            # if data is not provided retrun placeholder images
            if not data:
                recommendation_contents = [
                    {"id": 0, "poster": placeholder}] * 5

            else:
                recommendation_contents = [
                    {
                        "id": content["id"],
                        "poster": 'https://image.tmdb.org/t/p/original/' +
                        content["poster_path"]} for content in data["results"]]

        # If user has favorite contents
        else:
            # generate recommendation only using last 5
            for favorite_id in fav_contents_id[:-5]:
                url = recommendation_url.format(favorite_id)
                data = request_the_movie_api(url, dict())

                if data:
                    recommendation_contents.append(
                        {
                            "id": content["id"],
                            "poster": 'https://image.tmdb.org/t/p/original/' +
                            content["poster_path"]} for content in data["results"])

            if not recommendation_contents:
                recommendation_contents = [
                    {"id": 0, "poster": placeholder}] * 5

            else:
                # pick only 21 samples
                recommendation_contents = random.sample(
                    recommendation_contents, min(
                        len(recommendation_contents), 21))

        return JsonResponse(recommendation_contents, safe=False, status=200)

    else:
        return HttpResponseNotAllowed(['GET'])


def user_favorite_list(request, user_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                user = User.objects.get(id=user_id)
            # ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as _:
                return HttpResponse(status=404)
            fav_contents = list(user.favorite_contents.all().values())
            # ERR 400 : Fav Content Doesn't Exist
            if not fav_contents:
                return HttpResponse(status=400)
            return JsonResponse(fav_contents, safe=False, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['GET'])


def content_favorite(request, user_id, content_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            try:
                new_user = User.objects.get(id=user_id)
            # ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as _:
                return HttpResponse(status=404)
            # ERR 400 : Content Doesn't Exist
            try:
                content = Content.objects.get(id=content_id)
            except(Content.DoesNotExist) as _:
                return HttpResponse(status=400)
            content.favorite_users.add(new_user)
            content.favorite_cnt = content.favorite_cnt + 1
            content.save()
            fav_users = list(content.favorite_users.all().values())
            response_dict = {
                "id": content.id,
                "favorite_users": fav_users,
                "favorite_cnt": content.favorite_cnt
            }
            return JsonResponse(response_dict, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                User.objects.get(id=user_id)
            # ERR 404 : User Doesn't Exist
            except(User.DoesNotExist) as _:
                return HttpResponse(status=404)
            try:
                content = Content.objects.get(id=content_id)
            # ERR 400 : Content Doesn't Exist
            except(Content.DoesNotExist) as _:
                return HttpResponse(status=400)
            content.favorite_users.remove(request.user)
            content.favorite_cnt = content.favorite_cnt - 1
            return HttpResponse(status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    # ERR 405 : METHOD NOT ALLOWED
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])


def content_trending(request):
    if request.method == "GET":
        if not request.user.is_authenticated:
            # ERR 401 : Not Authenticated
            return HttpResponse(status=401)

        placeholder = 'https://via.placeholder.com/150?text=No+Content'
        trending_url = 'https://api.themoviedb.org/3/movie/popular'

        data = request_the_movie_api(trending_url, dict())

        # if data is not provided retrun placeholder images
        if not data:
            trending_contents = [{"id": 0, "poster": placeholder}] * 5

        else:
            trending_contents = [
                {
                    "id": content["id"],
                    "poster": 'https://image.tmdb.org/t/p/original/' +
                    content["poster_path"]} for content in data["results"]]

        return JsonResponse(trending_contents, safe=False, status=200)

    else:
        return HttpResponseNotAllowed(['GET'])

# Review


def review_content(request, content_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                content = Content.objects.get(id=content_id)
            # ERR 404 : Content Doesn't Exist
            except(Content.DoesNotExist) as _:
                return HttpResponse(status=404)
            reviews = list(content.content_reviews.all().values())
            # ERR 400 : Review Doesn't Exist
            if not reviews:
                return HttpResponse(status=400)
            return JsonResponse(reviews, safe=False, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    elif request.method == 'POST':
        if request.user.is_authenticated:
            try:
                req_data = json.loads(request.body.decode())
                review_detail = req_data['detail']
                review_user = request.user
            # ERR 400 : KeyErr, JSONDecodeErr
            except (KeyError, JSONDecodeError) as _:
                return HttpResponseBadRequest()
            try:
                review_content = Content.objects.get(id=content_id)
            # ERR 404 : Content Doesn't Exist
            except (Content.DoesNotExist) as _:
                return HttpResponse(status=404)
            review = Review(content=review_content,
                            detail=review_detail, user=review_user)
            review.save()
            response_dict = {
                'id': review.id,
                'content': review.content.id,
                'detail': review.detail,
                'user': review.user.id,
                'created_at': review.created_at}
            return JsonResponse(response_dict, status=201)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])


def review_detail(request, review_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            # ERR 404 : Review Doesn't Exist
            except (Review.DoesNotExist) as _:
                return HttpResponse(status=404)
            response_dict = {
                "id": review.id,
                "content_id": review.content.id,
                "detail": review.detail,
                "user": review.user.id,
                "created_at": review.created_at}
            return JsonResponse(response_dict, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            review_detail = req_data['detail']
            try:
                review = Review.objects.get(id=review_id)
            # ERR 404 : Review Doesn't Exist
            except(Review.DoesNotExist) as _:
                return HttpResponse(status=404)
            # ERR 403 : Not Author
            if(review.user != request.user):
                return HttpResponse(status=403)
            review.detail = review_detail
            review.save()
            response_dict = {
                "id": review.id,
                "content_id": review.content.id,
                "detail": review.detail,
                "user_id": review.user.id}
            return JsonResponse(response_dict, status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            # ERR 404 : Review Doesn't Exist
            except(Review.DoesNotExist) as _:
                return HttpResponse(status=404)
            review.delete()
            return HttpResponse(status=200)
        # ERR 401 : Not Authenticated
        else:
            return HttpResponse(status=401)

    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])
