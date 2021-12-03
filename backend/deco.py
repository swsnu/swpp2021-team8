from django.http import HttpResponse


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
