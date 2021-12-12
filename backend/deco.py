from django.http import HttpResponse
from threading import Timer


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

#  Copyright (c)  2020, salesforce.com, inc.
#  All rights reserved.
#  SPDX-License-Identifier: BSD-3-Clause
#  For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/BSD-3-Clause
def debounce(wait_time):
    """
    Decorator that will debounce a function so that it is called after wait_time seconds
    If it is called multiple times, will wait for the last call to be debounced and run only this one.
    """

    def decorator(function):
        def debounced(*args, **kwargs):
            def call_function():
                debounced._timer = None
                return function(*args, **kwargs)

            if debounced._timer is not None:
                debounced._timer.cancel()

            debounced._timer = Timer(wait_time, call_function)
            debounced._timer.start()

        debounced._timer = None
        return debounced
    return decorator