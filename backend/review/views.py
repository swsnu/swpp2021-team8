import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
from deco import login_required
from .models import Review


@login_required
@require_http_methods(["GET", "PUT", "DELETE"])
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
            "user_id": review.user.id,
            "username": review.user.username,
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
            "user_id": review.user.id,
            "username": review.user.username,
            "created_at": review.created_at
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
