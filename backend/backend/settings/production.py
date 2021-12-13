import my_settings
from .base import *

DEBUG = False

ALLOWED_HOSTS = ['ec2-15-164-57-207.ap-northeast-2.compute.amazonaws.com', '15.164.57.207']

DATABASES = my_settings.DATABASES
