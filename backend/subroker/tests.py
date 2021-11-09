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
        new_ott = Ott(ott='Watcha', membership='Basic', max_people=1, cost=7900, image= tempfile.NamedTemporaryFile(suffix=".jpg").name)
        new_ott.save()
        new_ott2 = Ott(ott='Watcha', membership='Standard', max_people=4, cost=7900, image= tempfile.NamedTemporaryFile(suffix=".jpg").name)
        new_ott2.save()
        """
        new_content = Content(the_movie_id=1234, name= 'movie_name', favorite_cnt= 1)
        new_content.save()
        new_content.favorite_users.add(new_user2)
        new_content.save()
        new_review = Review(content=new_content, detail='review_detail', user=new_user1)
        new_review.save()
        """
        new_group = Group(name='group_name', description='group_description', is_public = True, password = -1, will_be_deleted= False, membership = new_ott, payday=1, account_bank='Woori', account_name='group1_account', account_number='1234', leader=new_user1, current_people=1)
        new_group.save()
        new_group2 = Group(name='group_name', description='group_description', is_public = True, password = -1, will_be_deleted= False, membership = new_ott2, payday=1, account_bank='Woori', account_name='group2_account', account_number='1234', leader=new_user1, current_people=1)
        new_group2.save()
        

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

    #group list GET
    def test_group_list_get(self):
        client = Client()

        #GET ERR unauthorized user request : 401
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 401)

        #login
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')

        #GET SUCCESS : 200
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())[0]
        self.assertEqual(1, group['id'])
        self.assertEqual('group_name', group['name'])
        self.assertEqual('group_description', group['description'])
        self.assertEqual(True, group['is_public'])
        self.assertEqual(-1, group['password'])
        self.assertEqual(False, group['will_be_deleted'])
        self.assertEqual(1, group['payday'])
        self.assertEqual('Woori', group['account_bank'])
        self.assertEqual('1234', group['account_number'])
        self.assertEqual('group1_account', group['account_name'])
        self.assertEqual(1, group['leader_id'])
        self.assertEqual(1, group['current_people'])

        #GET ERR no groups : 404
        client.delete('/api/group/1/')
        client.delete('/api/group/2/')
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 404)

    
    #group list POST
    def test_group_list_post(self):
        client = Client()
        
        #POST ERR unauthorized user request : 401
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas", 
            "description": "This group is for watchaaaas", 
            "is_public": "True", 
            "password": "-1",
            "membership": "1", 
            "payday" : "13", 
            "account_bank": "Woori", 
            "account_number": "1002-550-123445", 
            "account_name": "Hyeju Na"
            }), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        #login
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')
    
        #POST SUCCESS : 201
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas", 
            "description": "This group is for watchaaaas", 
            "is_public": "True", 
            "password": "-1",
            "membership": "1", 
            "payday" : "13", 
            "account_bank": "Woori", 
            "account_number": "1002-550-123445", 
            "account_name": "Hyeju Na"
            }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        #POST ERR KeyErr, JSONDecodeErr : 400
        response = client.post('/api/group/', json.dumps({"name": "Watchaas"}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

        #POST ERR Ott doesn't exist : 404
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas", 
            "description": "This group is for watchaaaas", 
            "is_public": "True", 
            "password": "-1",
            "membership": "50", 
            "payday" : "13", 
            "account_bank": "Woori", 
            "account_number": "1002-550-123445", 
            "account_name": "Hyeju Na"
            }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    #group detail : GET
    def test_group_detail_get(self):
        client = Client()

        #GET ERR unauthorized user request : 401
        response = client.get('/api/group/1/')
        self.assertEqual(response.status_code, 401)

        #login
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')

        #GET SUCCESS : 200
        response = client.get('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())
        self.assertEqual(1, group['id'])
        self.assertEqual('group_name', group['name'])
        self.assertEqual('group_description', group['description'])
        self.assertEqual(True, group['is_public'])
        self.assertEqual(-1, group['password'])
        self.assertEqual(False, group['will_be_deleted'])
        self.assertEqual(1, group['payday'])
        self.assertEqual('Woori', group['account_bank'])
        self.assertEqual('1234', group['account_number'])
        self.assertEqual('group1_account', group['account_name'])
        self.assertEqual(1, group['current_people'])

        #GET ERR group doesn't exist : 404
        response = client.get('/api/group/10/')
        self.assertEqual(response.status_code, 404)

    #group detail : DELETE
    def test_group_detail_delete(self):
        client=Client()
        #DELETE ERR unauthorized user request : 401
        response = client.delete('/api/group/1/')
        self.assertEqual(response.status_code, 401)

        #DELETE SUCCESS
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')
        response = client.delete('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Group.objects.all().count(), 1)

        #DELETE ERR no article exists : 404
        response = client.delete('/api/group/10/')
        self.assertEqual(response.status_code, 404)

    #group detail : 405 ERROR (METHOD NOT ALLOWED)
    def test_group_detail_405(self):
        client=Client()
        #POST : NOT ALLOWED
        response = client.post('/api/group/10/')
        self.assertEqual(response.status_code, 405)

    #group add user : PUT
    def test_group_add_user_put(self):
        client=Client()
        #PUT ERR unauthorized user request : 401
        response = client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        #PUT SUCESS : 200
        client.post('/api/login/', json.dumps({'username': 'user2', 'password': 'user2_password'}),
                               content_type='application/json')
        response = client.put('/api/group/2/user/')
        self.assertEqual(response.status_code, 200)

        #PUT ERR no group exists : 404
        response = client.put('/api/group/10/user/')
        self.assertEqual(response.status_code, 404)

        #PUT ERR group is full : 400
        response = client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 400)


    #group add user : DELETE
    def test_group_add_user_delete(self):
        client=Client()
        #DELETE ERR unauthorized user request : 401
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        #DELETE SUCESS : 200
        client.post('/api/login/', json.dumps({'username': 'user1', 'password': 'user1_password'}),
                               content_type='application/json')
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 200)
        #self.assertEqual(Group.objects.all().values()[0].members.count(), 0)

        #DELETE ERR no group exists : 404
        response = client.delete('/api/group/5/user/')
        self.assertEqual(response.status_code, 404)

    #group add user : 405 ERROR (METHOD NOT ALLOWED)
    def test_group_add_user_405(self):
        client=Client()
        #POST : NOT ALLOWED
        response = client.post('/api/group/1/user/')
        self.assertEqual(response.status_code, 405)

    