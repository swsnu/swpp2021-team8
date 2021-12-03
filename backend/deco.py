from django.http import HttpResponse

def require_http_methods(methods):
    """
    Decorator to check whether user sends request using allowed method
    """
    def check_request(func):
        def wrapper(*args, **kwargs):
            if args and args[0].method in methods:
                return func(*args, **kwargs)
            return HttpResponse(status=405)
        return wrapper
    return check_request

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