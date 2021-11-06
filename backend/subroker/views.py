from django.shortcuts import render
from django.db.models.query import EmptyQuerySet
from django.http import HttpResponse, HttpResponseNotAllowed, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login, logout
from django.views.decorators import csrf
from django.views.decorators.csrf import ensure_csrf_cookie
import json
from json.decoder import JSONDecodeError
from .models import Ott, Group, Content, Review
from django.core.exceptions import ObjectDoesNotExist


#signup/ : User Sign Up
def signup(request):
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        User.objects.create_user(username, password)
        return HttpResponse(status=201)
    else:
        return HttpResponseNotAllowed(['POST'])

#token/ : Token
@ensure_csrf_cookie
def token(request):
    if request.method == 'GET':
        return HttpResponse(status=204)
    else:
        return HttpResponseNotAllowed(['GET'])

#login/ : User Log In
def login(request):
    if request.method=='POST' :
        req_data = json.loads(request.body.decode())
        username = req_data['username']
        password = req_data['password']
        try:
            user = User.objects.get(username = username)
        except (User.DoesNotExist) as e:
            return HttpResponse(status=401)
        if user.check_password(password) == False:
            return HttpResponse(status=401)
        auth_login(request, user)
        return HttpResponse(status=204)

    else:
        return HttpResponseNotAllowed(['POST'])

#logout/ : User Log Out
def logout(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            logout(request)
            return HttpResponse(status=204)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET'])

#Group
def group_list(request):    
    if request.method == 'GET':
        if request.user.is_authenticated:
            group_all_list = [group for group in Group.objects.all().values()]
            if not group_all_list:
                return HttpResponse(status=404)
            return JsonResponse(group_all_list, safe=False, status=200)
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
                group_ott = req_data['ott']
                group_payday = int(req_data['payday'])
                group_account_bank = req_data['account_bank']
                group_account_number = req_data['account_number']
                group_account_name = req_data['account_name']
                group_leader = request.user
            except (JSONDecodeError) as e:
                return HttpResponseBadRequest()
            try:
                group_membership = Ott.objects.get(id=req_data['membership'])
            except (Ott.DoesNotExist) as e:
                return HttpResponse(status=404)
            group = Group(
                name=group_name, 
                description=group_description, 
                is_public=group_is_public, 
                password=group_password, 
                ott=group_ott,
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
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def group_info(request, group_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            except (Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            member_arr = []
            members = group.members.all()
            for member in members:
                member_arr.append(member.id)
            return JsonResponse({
                "id": group.id, 
                "name": group.name, 
                "description": group.description, 
                "is_public": group.is_public, 
                "password": group.password, 
                "created_at": group.created_at,
                "will_be_deleted": group.will_be_deleted,
                "ott": group.ott,
                "membership_id": group.membership.id, 
                "payday": group.payday, 
                "account_bank": group.account_bank, 
                "account_number": group.account_number, 
                "account_name": group.account_name, 
                "leader": group.leader.id,
                "members": member_arr,
                "current_people": group.current_people
                }, status=200)
        else:
            return HttpResponse(status=401)

    #TODO
    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            group_name = req_data['name']
            group_description = req_data['description']
            #group_is_public = bool(req_data['is_public'])
            group_password = int(req_data['password'])
            group_account_bank = req_data['account_bank']
            group_account_number = req_data['account_number']
            group_account_name = req_data['account_name']
            try:
                group = Group.objects.get(id=group_id)
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            if(group.leader != request.user):
                response_dict = {"leader": group.leader.id, "request user": request.user.id}
                return JsonResponse(response_dict, status=403)
            group.name=group_name, 
            group.description=group_description, 
            #group.is_public=group_is_public, 
            group.password=group_password, 
            group.account_bank = group_account_bank, 
            group.account_number=group_account_number, 
            group.account_name=group_account_name, 
            group.save()
            response_dict = {
                "id": group.id, 
                "name": group.name, 
                "description": group.description, 
                "is_public": group.is_public, 
                "password": group.password, 
                "created_at": group.created_at,
                "will_be_deleted": group.will_be_deleted,
                "ott": group.ott,
                "membership_id": group.membership.id, 
                "payday": group.payday, 
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
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            group.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
        
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

def group_add_user(request, group_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            new_member = request.user
            try:
                group = Group.objects.get(id=group_id)
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            if(group.current_people >= group.membership.max_people):
                return HttpResponseBadRequest
            group.members.add(new_member)
            group.save()
            member_arr = []
            members = group.members.all()
            for member in members:
                member_arr.append(member.id)
            response_dict = {
                "id": group.id, 
                "members": member_arr
            }
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                group = Group.objects.get(id=group_id)
            except(Group.DoesNotExist) as e:
                return HttpResponse(status=404)
            group.members.remove(request.user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])
#Content
def content_list(request, content_id):
    return HttpResponse("content search")

def content_info(request, content_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                content = Content.objects.get(id=content_id)
            except (Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            user_arr = []
            users = content.user_id.all()
            for user in users:
                user_arr.append(user.id)
            return JsonResponse({
                "id": content.id, 
                "the_movie_id": content.the_movie_id,
                "name": content.name,
                "favorite_count": content.favorite_cnt,
                "user_id": user_arr
                }, status=200)
        else:
            return HttpResponse(status=401)

def recommendation(request, user_id):
    return HttpResponse("recommendation")

def user_favorite_list(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            fav_return = [content for content in Content.objects.filter(user_id__in=[request.user]).values()]
            if not fav_return:
                return HttpResponse(status=404)
            return JsonResponse(fav_return, safe=False, status=200)
        else:
            return HttpResponse(status=401)

def content_favorite(request, content_id):
    if request.method == 'PUT':
        if request.user.is_authenticated:
            new_fav = request.user
            try:
                content = Content.objects.get(id=content_id)
            except(Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            content.user_id.add(new_fav)
            content.save()
            fav_arr = []
            fav_users = content.user_id.all()
            for fav_user in fav_users:
                fav_arr.append(fav_user.id)
            response_dict = {
                "id": content.id, 
                "members": fav_arr
            }
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                content = Content.objects.get(id=content_id)
            except(Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            content.user_id.remove(request.user)
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['PUT', 'DELETE'])

def trending(request):
    return HttpResponse("trending")

#Review
def review_content(request, content_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            review_return = [review for review in Review.objects.filter(content__id__startswith=str(content_id)).values()]
            if not review_return:
                return HttpResponse(status=404)
            return JsonResponse(review_return, safe=False, status=200)
        else:
            return HttpResponse(status=401)
    elif request.method == 'POST':
        if request.user.is_authenticated:
            try:
                req_data = json.loads(request.body.decode())
                review_detail = req_data['detail']
                review_user = request.user
            except (KeyError, JSONDecodeError) as e:
                return HttpResponseBadRequest()
            try:
                review_content = Content.objects.get(id=content_id)
            except (Content.DoesNotExist) as e:
                return HttpResponse(status=404)
            review = Review(content=review_content, detail=review_detail, user_id=review_user)
            review.save()
            response_dict = {'id': review.id, 'content': review.content.id, 'detail': review.detail, 'user_id':review.user_id.id, 'created_at': review.created_at}
            return JsonResponse(response_dict, status=201)
        else:
            return HttpResponse(status=401)
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])

def review_info(request, review_id):
    if request.method == 'GET':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            except (Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            response_dict = {"id": review.id, "content": review.content.id, "detail": review.detail, "user_id": review.user_id.id, "created_at": review.created_at}
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'PUT':
        if request.user.is_authenticated:
            req_data = json.loads(request.body.decode())
            review_detail = req_data['detail']
            try:
                review = Review.objects.get(id=review_id)
            except(Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            if(review.user_id != request.user):
                return HttpResponse(status=403)
            review.detail = review_detail
            review.save()
            response_dict = {"id": review.id, "content": review.content.id, "detail": review.detail, "user_id": review.user_id.id}
            return JsonResponse(response_dict, status=200)
        else:
            return HttpResponse(status=401)

    elif request.method == 'DELETE':
        if request.user.is_authenticated:
            try:
                review = Review.objects.get(id=review_id)
            except(Review.DoesNotExist) as e:
                return HttpResponse(status=404)
            review.delete()
            return HttpResponse(status=200)
        else:
            return HttpResponse(status=401)
        
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])

