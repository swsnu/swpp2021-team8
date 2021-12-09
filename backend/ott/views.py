from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from deco import login_required
from .models import Ott

@login_required
@require_http_methods(["GET"])
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


@login_required
@require_http_methods(["GET"])
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
