import json
from django.contrib.auth.models import User
from django.http.response import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

from .models import Notification

@csrf_exempt
@require_http_methods(["GET", "POST", "DELETE"])
def handle_notification(request):
    """
    /api/notification/?user=""&&id=""
    Handle notification related events

    GET
        return notification that receiver is user

    DELETE
        delete current id's notification
    """

    if request.method == "GET":
        user_id = request.GET.get("user", None)

        if not user_id:
            return HttpResponseBadRequest()

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return HttpResponseNotFound()

        response = [
            {
                "id": notification.id,
                "type": notification.type,
                "content": notification.content,
                "created_at": notification.created_at
            } for notification in user.notification.all()]

        return JsonResponse(response, safe=False, status=200)

    elif request.method == "DELETE":
        body = json.loads(request.body.decode())

        receiver = body["receiver"]

        try:
            notification = Notification.objects.get(id=receiver)
        except Notification.DoesNotExist:
            return HttpResponseNotFound()

        notification.delete()

        return HttpResponse(status=200)
