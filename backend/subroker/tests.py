from django.test import TestCase, Client, client
import json
from .models import Review, Content, Group, Ott
from django.contrib.auth.models import User
from django.core.files import File
import tempfile
# Create your tests here.

class SubrokerTestCase(TestCase):
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 403)  # Request without csrf token returns 403 response

        response = client.get('/api/token/')
        csrftoken = response.cookies['csrftoken'].value  # Get csrf token from cookie

        response = client.post('/api/signup/', json.dumps({'username': 'chris', 'password': 'chris'}),
                               content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def setUp(self):
        new_user1 = User.objects.create_user(username='user1', password='user1_password')  # Django default user model
        new_user2 = User.objects.create_user(username='user2', password='user2_password')
        """
        new_ott = Ott(ott='Watcha', membership='Basic', max_people=1, cost=7900, image= tempfile.NamedTemporaryFile(suffix=".jpg").name)
        new_ott.save()
        new_content = Content(the_movie_id=1234, name= 'movie_name', favorite_cnt= 1)
        new_content.save()
        new_content.favorite_users.add(new_user2)
        new_content.save()
        new_review = Review(content=new_content, detail='review_detail', user=new_user1)
        new_review.save()
        new_group = Group(name='group_name', description='group_description', is_public = True, password = -1, will_be_deleted= False, membership = new_ott, payday=1, account_bank='IBK', account_name='account_name', account_number='account_number', leader=new_user1, current_people=2)
        new_group.save()
        new_group.members.add(new_user2)
        new_group.save()
        """

    def test_signup(self):
        client = Client()

        #POST successful request : 201
        response = client.post('/api/signup/', json.dumps({'username': 'test', 'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        #POST User Already Exists : 400
        response = client.post('/api/signup/', json.dumps({'username': 'user1', 'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 400)


    #signup : 405 ERROR (METHOD NOT ALLOWED)
    def test_signup_405(self):
        client=Client()
        #GET : NOT ALLOWED
        response = client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        #PUT : NOT ALLOWED
        response = client.put('/api/signup/')
        self.assertEqual(response.status_code, 405)

        #DELETE : NOT ALLOWED
        response = client.delete('/api/signup/')
        self.assertEqual(response.status_code, 405)

    #token : 405 ERROR (METHOD NOT ALLOWED)
    def test_token_405(self):
        client=Client()
        #POST : NOT ALLOWED
        response = client.post('/api/token/')
        self.assertEqual(response.status_code, 405)

        #PUT : NOT ALLOWED
        response = client.put('/api/token/')
        self.assertEqual(response.status_code, 405)

        #DELETE : NOT ALLOWED
        response = client.delete('/api/token/')
        self.assertEqual(response.status_code, 405)

    #login : 
    def test_login(self):
        client= Client()
        #POST SUCCESS : 201
        response = client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 204)

        #POST ERR 'username' doesn't exist : 401
        response = client.post('/api/login/', json.dumps({'username': 'user10', 'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

        #POST ERR 'password' doesn't match : 401
        response = client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'wrong_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)
    
    #login : 405 ERROR (METHOD NOT ALLOWED)
    def test_login_405(self):
        client=Client()
        #GET : NOT ALLOWED
        response = client.get('/api/login/')
        self.assertEqual(response.status_code, 405)

        #PUT : NOT ALLOWED
        response = client.put('/api/login/')
        self.assertEqual(response.status_code, 405)

        #DELETE : NOT ALLOWED
        response = client.delete('/api/login/')
        self.assertEqual(response.status_code, 405)

    #logout
    def test_logout(self):
        client=Client()

        #GET SUCCESS : 200
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')

        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 204)

        #GET ERR unauthorized user request : 401
        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 401)

    #logout : 405 ERROR (METHOD NOT ALLOWED)
    def test_logout_405(self):
        client=Client()
        #POST : NOT ALLOWED
        response = client.post('/api/logout/')
        self.assertEqual(response.status_code, 405)

        #PUT : NOT ALLOWED
        response = client.put('/api/logout/')
        self.assertEqual(response.status_code, 405)

        #DELETE : NOT ALLOWED
        response = client.delete('/api/logout/')
        self.assertEqual(response.status_code, 405)
