import json
from django.test import TestCase, Client
from django.contrib.auth.models import User


class UserTestCase(TestCase):
    def setUp(self):
        """
        User
        ----
            id  username    password
            ------------------------
            1   user1       user1_password
            2   user2       user2_password
        """
        # Django default user model
        User.objects.create_user(username='user1', password='user1_password')
        User.objects.create_user(username='user2', password='user2_password')

        self.logged_in_client = Client()
        self.logged_in_client.post('/api/user/login/',
                                   json.dumps({'username': 'user1',
                                               'password': 'user1_password'}),
                                   content_type='application/json')

        self.not_logged_in_client = Client()

    def test_csrf(self):
        """
        /api/user/token/

        By default, csrf checks are disabled in test client
        To test csrf protection we enforce csrf checks here
        """
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/user/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json')

        self.assertEqual(response.status_code, 403)  # CSRF Token Error

        response = client.get('/api/user/token/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/user/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_token_405(self):
        """
        /api/user/token/

        POST, PUT, DELETE are not allowed
        """
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/user/token/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/user/token/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/user/token/')
        self.assertEqual(response.status_code, 405)

    def test_user(self):
        """
        /api/user/
        """
        # user is not logged in
        response = self.not_logged_in_client.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), {
                         "id": "", "username": "", "isLoggedIn": False, "notDeletedGroupCount": 0, "deletedGroupCount": 0})

        # user is logged in
        response = self.logged_in_client.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), {
                         "id": 1, "username": "user1", "isLoggedIn": True, "notDeletedGroupCount": 0, "deletedGroupCount": 0})

    def test_user_405(self):
        """
        /api/user/

        POST, PUT, DELETE are not allowed
        """
        client = Client()

        # POST : NOT ALLOWED
        response = client.post('/api/user/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/user/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/user/')
        self.assertEqual(response.status_code, 405)

    def test_signup(self):
        """
        /api/user/signup/
        """
        client = Client()

        # POST successful request : 201
        response = client.post('/api/user/signup/',
                               json.dumps({'username': 'test',
                                           'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # POST User Already Exists : 409
        response = client.post('/api/user/signup/',
                               json.dumps({'username': 'user1',
                                           'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 409)

    def test_signup_405(self):
        """
        /api/user/signup/

        GET, PUT, DELETE are not allowed
        """

        client = Client()
        # GET : NOT ALLOWED
        response = client.get('/api/user/signup/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/user/signup/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/user/signup/')
        self.assertEqual(response.status_code, 405)

    def test_login(self):
        """
        /api/user/login/
        """

        client = Client()
        # POST SUCCESS : 204
        response = client.post('/api/user/login/',
                               json.dumps({'username': 'user1',
                                           'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 204)

        # POST ERR 'username' doesn't exist : 401
        response = client.post('/api/user/login/',
                               json.dumps({'username': 'user10',
                                           'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # POST ERR 'password' doesn't match : 401
        response = client.post('/api/user/login/',
                               json.dumps({'username': 'user1',
                                           'password': 'wrong_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

    def test_login_405(self):
        """
        /api/user/login/

        GET, PUT, DELETE are not allowed
        """
        client = Client()
        # GET : NOT ALLOWED
        response = client.get('/api/user/login/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/user/login/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/user/login/')
        self.assertEqual(response.status_code, 405)

    def test_logout(self):
        """
        /api/user/logout/
        """
        response = self.logged_in_client.get('/api/user/logout/')
        self.assertEqual(response.status_code, 204)

        # GET ERR unauthorized user request : 401
        response = self.logged_in_client.get('/api/user/logout/')
        self.assertEqual(response.status_code, 401)
