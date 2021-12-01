import json
import time
import random
from json.decoder import JSONDecodeError
import requests
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout as auth_logout
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from django.conf import settings
from .models import Ott, Group, Content, Review

def login_required(func):
    """
    Decorator to check user is authenticated
    """
    def wrapper(request, *arg, **kwargs):
        if not request.user.is_authenticated:
            # ERR 401 : Not Authenticated
            return HttpResponse(status=401)
        return func(request, *arg, **kwargs)
    return wrapper

def request_the_movie_api(url, _params, max_retries = 2, sleep_time = 5):
    """
    Request The MOVIE API 

    Parameters
    ----------
    url : str
        URL of THE MOVIE API
    _parmas : dictionary
        additional parameters for request(e.g. API key, queries)
    max_retries : number
        number of retries when error occurs
    sleep_time : number
        wait time(second) between retries
    
    Return
    ------
    response : json
        HTTP response message in json type
    None
        Return None when error occurs
    """
    attempt_num = 0
    params = {'api_key': settings.THE_MOVIE_API_KEY}
    params.update(_params)

    while attempt_num < max_retries:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            return response.json()
        else:
            attempt_num += 1
            time.sleep(sleep_time)

    return None

@ensure_csrf_cookie
@require_http_methods(['GET'])
def token(request):
    """
    /api/token/

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
    /api/signup/

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
    /api/login/

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
    /api/logout/

    GET
        Logout user
    """
    if request.method == 'GET':
        auth_logout(request)
        return HttpResponse(status=204)

@require_http_methods(['GET', 'POST'])
@login_required
def group_list(request):
    """
    /api/group/

    GET
        get group info according to query

    POST
        make a new group with info
    """
    if request.method == 'GET':
        # query example
        # /api/group/?name=title-of-movie&ott=netflix__premium&ott=watcha__standard
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

        group_all_list = [{
            'id': group.id,
            'platform': group.membership.ott,
            'membership': group.membership.membership,
            'name': group.name,
            'leader': group.leader.username,
            'cost': group.membership.cost,
            'currentPeople': group.current_people,
            'maxPeople': group.membership.max_people,
            'payday': group.payday
        } for group in groups]

        return JsonResponse(group_all_list, safe=False, status=200)

    elif request.method == 'POST':
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

        group.members.add(request.user.id)
        group.save()

        response_dict = {
            'id': group.id,
            'name': group.name,
            'leader': group.leader.id
        }
        return JsonResponse(response_dict, status=201)

@require_http_methods(["GET", "PUT", "DELETE"])
@login_required
def group_detail(request, group_id):
    """
    /api/group/<int:group_id>/

    GET
        Get group detail information

    PUT
        Edit group detail information
    
    DELETE
        delete group
    """
    if request.method == 'GET':
        try:
            group = Group.objects.get(id=group_id)
        # ERR 404 : Group Doesn't Exist
        except (Group.DoesNotExist) as _:
            return HttpResponse(status=404)

        leader = User.objects.get(id=group.leader.id)
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
            "leader": { "id": leader.id, "username": leader.username},
        }

        return JsonResponse(response_dict, safe=False, status=200)

    elif request.method == 'PUT':
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

    elif request.method == 'DELETE':
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

@require_http_methods(["PUT", "DELETE"])
@login_required
def group_add_user(request, group_id):
    """
    /api/group/<int:group_id>/user/

    PUT
        Add current user to group

    DELETE
        Delete current user from group
    """
    if request.method == 'PUT':
        try:
            group = Group.objects.get(id=group_id)
        # ERR 404 : Group Doesn't Exist
        except(Group.DoesNotExist) as _:
            return HttpResponse(status=404)

        # ERR 400 : Group Is Full
        # print(f"curPeo: {group.current_people}, mem: {group.members.all().values()} before add")
        if(group.current_people >= group.membership.max_people):
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

    elif request.method == 'DELETE':
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

@require_http_methods(["GET"])
@login_required
def ott_list(request):
    """
    /api/ott/

    GET
        Get available ott list
    """
    if request.method == 'GET':
        otts = Ott.objects.all()
        ott_names = set([ott['ott'] for ott in otts.values()])
        ott_all_list = [{
            'name': name,
        } for name in ott_names]

        return JsonResponse(ott_all_list, safe=False, status=200)

@require_http_methods(["GET"])
@login_required
def ott_detail(request, ott_plan):
    """
    /api/ott/<slug:ott_plan>/

    GET
        Get detail information for OTT
    """
    if request.method == 'GET':
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

@require_http_methods(["GET"])
@login_required
def content_search(request, search_str):
    """
    /api/content/search/<str:search_str>/

    GET
        Receive search list from The movie API
    """
    if request.method == 'GET':
        url = 'https://api.themoviedb.org/3/search/movie'
        params = { 'query': search_str.replace(" ","+") }
        data = request_the_movie_api(url, params)

        if not data:
            return HttpResponse(status=405)

        search_contents = [{
            "id": content["id"],
            "poster": 'https://image.tmdb.org/t/p/original/' +  content["poster_path"] if content["poster_path"] else "",
            "title": content["title"]
        } for content in data["results"]]

        return JsonResponse(search_contents, status=200, safe=False)

@require_http_methods(["GET"])
@login_required
def content_detail(request, content_id):
    """
    /api/content/<int:content_id>/

    GET
        Get Content detail information from THE MOVIE API
    """
    if request.method == 'GET':
        url = 'https://api.themoviedb.org/3/movie/' + str(content_id)
        data = request_the_movie_api(url, dict())

        if not data:
            return HttpResponse(status=405)
 
        # If Content does not exist in DB, make a new Content
        try:
            content = Content.objects.get(id=data["id"])
        except Content.DoesNotExist as _:
            content = Content(id=data["id"])
            content.favorite_cnt = 0
            content.favorite_users.set([])
            content.save()

        content_detail = {
            "id": data["id"],
            "name": data["title"],
            "genres": ",".join([genre['name'] for genre in data['genres']]),
            "countries": ",".join([country['name'] for country in data['production_countries']]),
            "poster": 'https://image.tmdb.org/t/p/original/' + data['poster_path'],
            "overview": data["overview"],
            "release_date": data["release_date"],
            "rate": data["vote_average"],
            "favorite_users": list(content.favorite_users.all().values()),
            "favorite_cnt": content.favorite_cnt
        }

        return JsonResponse(content_detail, safe=False, status=200)

@require_http_methods(["GET"])
@login_required
def content_recommendation(request, user_id):
    """
    /api/content/<int:user_id>/recommendation/

    GET
        Get recommended contents for current user from THE MOIVE API
    """
    if request.method == "GET":
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            # ERR 404 : User Doesn't Exist
            return HttpResponse(status=404)

        fav_contents_id = [content["id"]
                           for content in user.favorite_contents.all().values()]
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
            for favorite_id in fav_contents_id[-5:]:
                url = recommendation_url.format(favorite_id)
                data = request_the_movie_api(url, dict())

                if data:
                    recommendation_contents.extend(
                        [{
                            "id": content["id"],
                            "poster": 'https://image.tmdb.org/t/p/original/' + content["poster_path"] 
                        } for content in data["results"]])

            if not recommendation_contents:
                recommendation_contents = [
                    {"id": 0, "poster": placeholder}] * 5

            else:
                # pick only 21 samples
                recommendation_contents = random.sample(
                    recommendation_contents, min(
                        len(recommendation_contents), 21))

        return JsonResponse(recommendation_contents, safe=False, status=200)

@require_http_methods(["GET"])
@login_required
def user_favorite_list(request, user_id):
    """
    /api/content/<int:user_id>/favorite/

    GET
        Get favorite contents for user_id
    """
    if request.method == 'GET':
        try:
            user = User.objects.get(id=user_id)
        # ERR 404 : User Doesn't Exist
        except(User.DoesNotExist) as _:
            return HttpResponse(status=404)

        fav_contents = list(user.favorite_contents.all().values())

        return JsonResponse(fav_contents, safe=False, status=200)

@require_http_methods(["PUT", "DELETE"])
@login_required
def content_favorite(request, user_id, content_id):
    """
    /api/content/<int:user_id>/favorite/<int:content_id>/

    PUT
        Add content to user's favorite list

    DELETE
        Delete content from user's favorite list
    """
    if request.method == 'PUT':
        try:
            new_user = User.objects.get(id=user_id)
        # ERR 404 : User Doesn't Exist
        except(User.DoesNotExist) as _:
            return HttpResponse(status=404)

        # ERR 400 : Content Doesn't Exist
        try:
            content = Content.objects.get(id=content_id)
        except(Content.DoesNotExist) as _:
            return HttpResponse(status=404)

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

    elif request.method == 'DELETE':
        try:
            User.objects.get(id=user_id)
        # ERR 404 : User Doesn't Exist
        except(User.DoesNotExist) as _:
            return HttpResponse(status=404)
            
        try:
            content = Content.objects.get(id=content_id)
        # ERR 400 : Content Doesn't Exist
        except(Content.DoesNotExist) as _:
            return HttpResponse(status=404)

        content.favorite_users.remove(request.user)
        content.favorite_cnt = content.favorite_cnt - 1

        return HttpResponse(status=200)

@require_http_methods(["GET"])
@login_required
def content_trending(request):
    """
    /api/content/trending/

    GET
        Get trending contents from THE MOVIE API
    """
    if request.method == "GET":
        placeholder = 'https://via.placeholder.com/150?text=No+Content'
        trending_url = 'https://api.themoviedb.org/3/movie/popular'

        data = request_the_movie_api(trending_url, dict())

        # if data is not provided retrun placeholder images
        if not data:
            trending_contents = [ {"id": 0, "poster": placeholder} ] * 5

        else:
            trending_contents = [
                {
                    "id": content["id"],
                    "poster": 'https://image.tmdb.org/t/p/original/' + content["poster_path"]
                } for content in data["results"]]

        return JsonResponse(trending_contents, safe=False, status=200)


@require_http_methods(["GET", "POST"])
@login_required
def review_content(request, content_id):
    """
    /api/content/<int:content_id>/review/

    GET
        Get reviews for specific content
    
    POST
        Create a new review for specific content
    """
    if request.method == 'GET':
        try:
            content = Content.objects.get(id=content_id)
        # ERR 404 : Content Doesn't Exist
        except(Content.DoesNotExist) as _:
            return HttpResponse(status=404)

        reviews = list(content.content_reviews.all().values())

        return JsonResponse(reviews, safe=False, status=200)
        
    elif request.method == 'POST':
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
            'created_at': review.created_at
        }

        return JsonResponse(response_dict, status=201)

@require_http_methods(["GET", "PUT", "DELETE"])
@login_required
def review_detail(request, review_id):
    """
    /api/review/<int:review_id>/

    GET
        Get detail information for a specific review

    PUT
        Change information of current review

    DELETE
        DELETE the review
    """
    if request.method == 'GET':
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
            "created_at": review.created_at
        }

        return JsonResponse(response_dict, status=200)


    elif request.method == 'PUT':
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
            "user_id": review.user.id
        }

        return JsonResponse(response_dict, status=200)

    elif request.method == 'DELETE':
        try:
            review = Review.objects.get(id=review_id)
        # ERR 404 : Review Doesn't Exist
        except(Review.DoesNotExist) as _:
            return HttpResponse(status=404)

        review.delete()

        return HttpResponse(status=200)
