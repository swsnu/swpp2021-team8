import json
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
from django.db.models import Q
from deco import login_required
from .models import Ott, Group

# Create your views here.

@login_required
@require_http_methods(['GET', 'POST'])
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
        query_id = request.GET.get("id", None)

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

        if query_id:
            groups = groups.filter(members__in=query_id)

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

        if not query_id:
            group_all_list = list(filter(lambda group: group["currentPeople"] < group["maxPeople"], group_all_list))

        group_all_list.sort(key=lambda group: (group["currentPeople"]/group["maxPeople"]), reverse=True)

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


@login_required
@require_http_methods(["GET", "PUT", "DELETE"])
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
            "isPublic": group.is_public,
            "password": group.password,
            "cost": group.membership.cost,
            "maxPeople": group.membership.max_people,
            "currentPeople": group.current_people,
            "members": members,
            "accountBank": group.account_bank,
            "accountNumber": group.account_number,
            "accountName": group.account_name,
            "description": group.description,
            "payday": group.payday,
            "leader": {"id": leader.id, "username": leader.username},
            "willBeDeleted": group.will_be_deleted
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


@login_required
@require_http_methods(["PUT", "DELETE"])
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
