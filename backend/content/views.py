import json
import time
import random
from json.decoder import JSONDecodeError
import requests
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from django.contrib.auth.models import User
from django.conf import settings
from deco import login_required
from review.models import Review
from .models import Content


def request_the_movie_api(url, _params, max_retries=2, sleep_time=5):
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


@login_required
@require_http_methods(["GET"])
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
            trending_contents = [{"id": 0, "poster": placeholder}] * 5

        else:
            trending_contents = [
                {
                    "id": content["id"],
                    "poster": 'https://image.tmdb.org/t/p/original/' + content["poster_path"]
                } for content in data["results"]]

        return JsonResponse(trending_contents, safe=False, status=200)


@login_required
@require_http_methods(["GET"])
def content_search(request, search_str):
    """
    /api/content/search/<str:search_str>/

    GET
        Receive search list from The movie API
    """
    if request.method == 'GET':
        url = 'https://api.themoviedb.org/3/search/movie'
        params = {'query': search_str.replace(" ", "+")}
        data = request_the_movie_api(url, params)

        if not data:
            return HttpResponse(status=405)

        search_contents = [{
            "id": content["id"],
            "poster": 'https://image.tmdb.org/t/p/original/' + content["poster_path"] if content["poster_path"] else "",
            "title": content["title"]
        } for content in data["results"]]

        return JsonResponse(search_contents, status=200, safe=False)


@login_required
@require_http_methods(["GET"])
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


@login_required
@require_http_methods(["GET"])
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


@login_required
@require_http_methods(["GET"])
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


@login_required
@require_http_methods(["PUT", "DELETE"])
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


@login_required
@require_http_methods(["GET", "POST"])
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