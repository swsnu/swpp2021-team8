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
    
    POST
        create a new notification

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
                "content": notification.content
            } for notification in user._notifications.all()]

        return JsonResponse(response, safe=False, status=200)

    elif request.method == "POST":
        body = json.loads(request.body.decode())

        receiver = body["receiver"]
        content = body["content"]

        try:
            user = User.objects.get(id=receiver)
        except User.DoesNotExist:
            return HttpResponseNotFound()

        Notification(receiver=user, content=content).save()

        return HttpResponse(status=201)

    elif request.method == "DELETE":
        body = json.loads(request.body.decode())

        receiver = body["receiver"]

        try:
            notification = Notification.objects.get(id=receiver)
        except Notification.DoesNotExist:
            return HttpResponseNotFound()

        notification.delete()

        return HttpResponse(status=200)