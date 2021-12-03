import json
import tempfile
from django.contrib.auth.models import User
from django.test import TestCase, Client
from .models import Ott


class OttTestCase(TestCase):
    def setUp(self):
        """
        SetUp DB for test

        User
        ----
            id  username    password
            ------------------------
            1   user1       user1_password
            2   user2       user2_password

        OTT
        ---
            ott     membership  max_people  cost    image
            ---------------------------------------------
            Watcha  Basic       1           7900    tempfile
            Watcha  Standard    4           7900    tempfile

        """
        User.objects.create_user(
            username='user1', password='user1_password')  # Django default user model
        User.objects.create_user(username='user2', password='user2_password')

        new_ott = Ott(
            ott='Watcha',
            membership='Basic',
            max_people=1,
            cost=7900,
            image=tempfile.NamedTemporaryFile(suffix=".jpg").name)
        new_ott.save()

        new_ott2 = Ott(
            ott='Watcha',
            membership='Standard',
            max_people=4,
            cost=7900,
            image=tempfile.NamedTemporaryFile(suffix=".jpg").name)
        new_ott2.save()

        self.logged_in_client = Client()
        response = self.logged_in_client.get('/api/user/token/')
        self.csrf_token = response.cookies['csrftoken'].value

        self.logged_in_client.post('/api/user/login/',
                                   json.dumps({'username': 'user1',
                                               'password': 'user1_password'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=self.csrf_token)

    def test_ott_list(self):
        """
        /api/ott/

        GET
        """
        client = Client()
        response = client.get('/api/ott/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.get('/api/ott/')
        self.assertEqual(response.status_code, 200)

    def test_ott_detail(self):
        """
        /api/ott/<slug:ott_plan>/

        GET
        """
        client = Client()

        response = client.get('/api/ott/watcha_basic/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.get('/api/ott/watchu_basic/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/api/ott/watcha_basic/')
        self.assertEqual(response.status_code, 200)
