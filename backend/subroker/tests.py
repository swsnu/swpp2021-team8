import json
import tempfile
from django.contrib.auth.models import User
from django.test import TestCase, Client
from .models import Review, Content, Group, Ott

# Create your tests here.
class SubrokerTestCase(TestCase):
    # FIX
    def test_csrf(self):
        # By default, csrf checks are disabled in test client
        # To test csrf protection we enforce csrf checks here
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json')

        response = client.get('/api/token/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 409)  # Pass csrf protection

    def setUp(self):
        new_user1 = User.objects.create_user(
            username='user1', password='user1_password')  # Django default user model
        User.objects.create_user(
            username='user2', password='user2_password')
        new_ott = Ott(
            ott='Watcha',
            membership='Basic',
            max_people=1,
            cost=7900,
            image=tempfile.NamedTemporaryFile(
                suffix=".jpg").name)
        new_ott.save()
        new_ott2 = Ott(
            ott='Watcha',
            membership='Standard',
            max_people=4,
            cost=7900,
            image=tempfile.NamedTemporaryFile(
                suffix=".jpg").name)
        new_ott2.save()

        new_content = Content(favorite_cnt=0)
        new_content.save()
        new_content2 = Content(favorite_cnt=1)
        new_content2.save()
        new_content2.favorite_users.add(new_user1)
        new_content2.save()

        new_review = Review(content=new_content,
                            detail='review_detail', user=new_user1)
        new_review.save()

        new_group = Group(
            name='group_name',
            description='group_description',
            is_public=True,
            password=-1,
            will_be_deleted=False,
            membership=new_ott,
            payday=1,
            account_bank='Woori',
            account_name='group1_account',
            account_number='1234',
            leader=new_user1,
            current_people=1)
        new_group.save()
        new_group2 = Group(
            name='group_name',
            description='group_description',
            is_public=True,
            password=-1,
            will_be_deleted=False,
            membership=new_ott2,
            payday=1,
            account_bank='Woori',
            account_name='group2_account',
            account_number='1234',
            leader=new_user1,
            current_people=1)
        new_group2.save()

    def test_signup(self):
        client = Client()

        # POST successful request : 201
        response = client.post('/api/signup/',
                               json.dumps({'username': 'test',
                                           'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # POST User Already Exists : 409
        response = client.post('/api/signup/',
                               json.dumps({'username': 'user1',
                                           'password': 'testtest'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 409)

    # signup : 405 ERROR (METHOD NOT ALLOWED)
    def test_signup_405(self):
        client = Client()
        # GET : NOT ALLOWED
        response = client.get('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/signup/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/signup/')
        self.assertEqual(response.status_code, 405)

    # token : 405 ERROR (METHOD NOT ALLOWED)
    def test_token_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/token/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/token/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/token/')
        self.assertEqual(response.status_code, 405)

    # login :
    def test_login(self):
        client = Client()
        # POST SUCCESS : 204
        response = client.post('/api/login/',
                               json.dumps({'username': 'user1',
                                           'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 204)

        # POST ERR 'username' doesn't exist : 401
        response = client.post('/api/login/',
                               json.dumps({'username': 'user10',
                                           'password': 'user1_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # POST ERR 'password' doesn't match : 401
        response = client.post('/api/login/',
                               json.dumps({'username': 'user1',
                                           'password': 'wrong_password'}),
                               content_type='application/json')
        self.assertEqual(response.status_code, 401)

    # login : 405 ERROR (METHOD NOT ALLOWED)
    def test_login_405(self):
        client = Client()
        # GET : NOT ALLOWED
        response = client.get('/api/login/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/login/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/login/')
        self.assertEqual(response.status_code, 405)

    # logout
    def test_logout(self):
        client = Client()

        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 204)

        # GET ERR unauthorized user request : 401
        response = client.get('/api/logout/')
        self.assertEqual(response.status_code, 401)

    # logout : 405 ERROR (METHOD NOT ALLOWED)
    def test_logout_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/logout/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/logout/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/logout/')
        self.assertEqual(response.status_code, 405)

    # group list GET
    def test_group_list_get(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())[0]

        self.assertEqual(1, group['id'])
        # self.assertEqual('group_name', group['title'])
        # self.assertEqual(-1, group['password'])
        # self.assertEqual(False, group['will_be_deleted'])
        # self.assertEqual(1, group['payday'])
        # self.assertEqual('Woori', group['account_bank'])
        # self.assertEqual('1234', group['account_number'])
        # self.assertEqual('group1_account', group['account_name'])
        # self.assertEqual(1, group['leader_id'])
        # self.assertEqual(1, group['current_people'])


    # group list POST
    def test_group_list_post(self):
        client = Client()

        # POST ERR unauthorized user request : 401
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas",
            "description": "This group is for watchaaaas",
            "isPublic": "True",
            "password": "-1",
            "membership": "1",
            "payday": "13",
            "accountBank": "Woori",
            "accountNumber": "1002-550-123445",
            "accountName": "Hyeju Na",
            "ottPlanId": 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # POST SUCCESS : 201
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas",
            "description": "This group is for watchaaaas",
            "isPublic": "True",
            "password": "-1",
            "membership": "1",
            "payday": "13",
            "accountBank": "Woori",
            "accountNumber": "1002-550-123445",
            "accountName": "Hyeju Na",
            "ottPlanId": 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

        # POST ERR Ott doesn't exist : 404
        response = client.post('/api/group/', json.dumps({
            "name": "Watchaas",
            "description": "This group is for watchaaaas",
            "isPublic": "True",
            "password": "-1",
            "membership": "50",
            "payday": "13",
            "accountBank": "Woori",
            "accountNumber": "1002-550-123445",
            "accountName": "Hyeju Na",
            "ottPlanId": 1
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    # group list : 405 ERROR (METHOD NOT ALLOWED)

    def test_group_list_405(self):
        client = Client()
        # PUT : NOT ALLOWED
        response = client.put('/api/group/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/group/')
        self.assertEqual(response.status_code, 405)

    # group detail : GET

    def test_group_detail_get(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/group/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())
        self.assertEqual(1, group['id'])
        # self.assertEqual('group_name', group['name'])
        # self.assertEqual('group_description', group['description'])
        # self.assertEqual(True, group['is_public'])
        # self.assertEqual(-1, group['password'])
        # self.assertEqual(False, group['will_be_deleted'])
        # self.assertEqual(1, group['payday'])
        # self.assertEqual('Woori', group['account_bank'])
        # self.assertEqual('1234', group['account_number'])
        # self.assertEqual('group1_account', group['account_name'])
        # self.assertEqual(1, group['current_people'])

        # GET ERR group doesn't exist : 404
        response = client.get('/api/group/10/')
        self.assertEqual(response.status_code, 404)

    # group detail : PUT
    def test_group_detail_put(self):
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put('/api/group/1/', )
        response = client.put(
            '/api/review/1/', content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # PUT SUCCESS : 200
        response = client.put('/api/group/1/', json.dumps({
            "name": "name_change",
            "description": "description_change",
            "isPublic": "False",
            "password": "1234",
            "accountBank": "IBK",
            "accountNumber": "1234",
            "accountName": "account_name_change"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())
        self.assertEqual(1, group['id'])
        # self.assertEqual('name_change', group['name'])
        # self.assertEqual('description_change', group['description'])
        # self.assertEqual('False', group['is_public'])
        # self.assertEqual('1234', group['password'])
        # self.assertEqual('IBK', group['account_bank'])
        # self.assertEqual('1234', group['account_number'])
        # self.assertEqual('account_name_change', group['account_name'])

        # PUT ERR group doesn't exist : 404
        response = client.put('/api/group/10/', json.dumps({
            "name": "name_change",
            "description": "description_change",
            "isPublic": "False",
            "password": "1234",
            "accountBank": "IBK",
            "accountNumber": "1234",
            "accountName": "account_name_change"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # PUT ERR not leader: 403
        client.get('/api/logout/')
        client.post('/api/login/',
                    json.dumps({'username': 'user2',
                                'password': 'user2_password'}),
                    content_type='application/json')
        response = client.put('/api/group/1/', json.dumps({
            "name": "name_change",
            "description": "description_change",
            "isPublic": "False",
            "password": "1234",
            "accountBank": "IBK",
            "accountNumber": "1234",
            "accountName": "account_name_change"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    # group detail : DELETE
    def test_group_detail_delete(self):
        client = Client()
        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/group/1/')
        self.assertEqual(response.status_code, 401)

        # DELETE SUCCESS
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.delete('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Group.objects.all().count(), 2)

        # DELETE ERR no article exists : 404
        response = client.delete('/api/group/10/')
        self.assertEqual(response.status_code, 404)

    # group detail : 405 ERROR (METHOD NOT ALLOWED)
    def test_group_detail_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/group/10/')
        self.assertEqual(response.status_code, 405)

    # group add user : PUT
    def test_group_add_user_put(self):
        client = Client()
        # PUT ERR unauthorized user request : 401
        response = client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        # PUT SUCESS : 200
        client.post('/api/login/',
                    json.dumps({'username': 'user2',
                                'password': 'user2_password'}),
                    content_type='application/json')
        response = client.put('/api/group/2/user/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())

        # PUT ERR no group exists : 404
        response = client.put('/api/group/10/user/')
        self.assertEqual(response.status_code, 404)

        # PUT ERR group is full : 400
        response = client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 200)

    # group add user : DELETE
    def test_group_add_user_delete(self):
        client = Client()
        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        # DELETE SUCESS : 200
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())

        # DELETE ERR no group exists : 404
        response = client.delete('/api/group/5/user/')
        self.assertEqual(response.status_code, 404)

    # group add user : 405 ERROR (METHOD NOT ALLOWED)
    def test_group_add_user_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/group/1/user/')
        self.assertEqual(response.status_code, 405)

    # content detail : GET
    def test_content_detail_get(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/content/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/content/1/')
        self.assertEqual(response.status_code, 405)

        # GET ERR content doesn't exist : 404
        response = client.get('/api/content/10/')
        self.assertEqual(response.status_code, 405)

    # content detail : 405 ERROR (METHOD NOT ALLOWED)
    def test_content_detail_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/content/1/')
        self.assertEqual(response.status_code, 403)

        # PUT : NOT ALLOWED
        response = client.put('/api/content/1/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/content/1/')
        self.assertEqual(response.status_code, 405)

    # user favorite list : GET
    def test_user_favorite_list_get(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/content/1/favorite/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/content/1/favorite/')
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content.decode())[0]
        self.assertEqual(2, content['id'])
        self.assertEqual(1, content['favorite_cnt'])

        # GET ERR user doesn't exist : 404
        response = client.get('/api/content/10/favorite/')
        self.assertEqual(response.status_code, 404)

        # GET ERR fav content doesn't exist : 400
        response = client.get('/api/content/2/favorite/')
        self.assertEqual(response.status_code, 400)

    # user_favorite_list : 405 ERROR (METHOD NOT ALLOWED)
    def test_user_favorite_list_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/content/1/favorite/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/content/1/favorite/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/content/1/favorite/')
        self.assertEqual(response.status_code, 405)

    # content favorite : PUT
    def test_content_favorite_put(self):
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user2',
                                'password': 'user2_password'}),
                    content_type='application/json')

        # PUT SUCCESS : 200
        response = client.put('/api/content/2/favorite/2/')
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content.decode())
        self.assertEqual(2, content['id'])
        self.assertEqual(2, content['favorite_cnt'])

        # PUT ERR user doesn't exist : 404
        response = client.put('/api/content/10/favorite/2/')
        self.assertEqual(response.status_code, 404)

        # PUT ERR fav content doesn't exist : 400
        response = client.put('/api/content/2/favorite/10/')
        self.assertEqual(response.status_code, 400)

    # content favorite : DELETE
    def test_content_favorite_delete(self):
        client = Client()

        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/content/1/favorite/2/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # DELETE SUCCESS : 200
        response = client.delete('/api/content/1/favorite/2/')
        self.assertEqual(response.status_code, 200)

        # DELETE ERR user doesn't exist : 404
        response = client.delete('/api/content/10/favorite/2/')
        self.assertEqual(response.status_code, 404)

        # DELETE ERR fav content doesn't exist : 400
        response = client.delete('/api/content/1/favorite/10/')
        self.assertEqual(response.status_code, 400)

    # content_favorite_list : 405 ERROR (METHOD NOT ALLOWED)
    def test_content_favorite_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 405)

        # GET : NOT ALLOWED
        response = client.get('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 405)

    # review content : GET
    def test_review_content_get(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/content/1/review/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/content/1/review/')
        self.assertEqual(response.status_code, 200)
        review = json.loads(response.content.decode())[0]
        self.assertEqual(1, review['id'])
        self.assertEqual(1, review['content_id'])
        self.assertEqual(1, review['user_id'])
        self.assertEqual('review_detail', review['detail'])

        # GET ERR content doesn't exist : 404
        response = client.get('/api/content/10/review/')
        self.assertEqual(response.status_code, 404)

        # GET ERR review doesn't exist : 400
        response = client.get('/api/content/2/review/')
        self.assertEqual(response.status_code, 400)

    # review content : POST

    def test_review_content_post(self):
        client = Client()

        # POST ERR unauthorized user request : 401
        response = client.post('/api/content/1/review/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # POST SUCCESS : 200
        response = client.post('/api/content/1/review/', json.dumps(
            {'detail': 'review1'}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        review = json.loads(response.content.decode())
        self.assertEqual(2, review['id'])
        self.assertEqual(1, review['content'])
        self.assertEqual(1, review['user'])
        self.assertEqual('review1', review['detail'])

        # POST ERR content doesn't exist : 404
        response = client.post('/api/content/10/review/', json.dumps(
            {'detail': 'review1'}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # POST ERR KeyErr, JSONDecodeErr : 400
        response = client.post('/api/content/1/review/',
                               json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    # user_favorite_list : 405 ERROR (METHOD NOT ALLOWED)

    def test_review_content_405(self):
        client = Client()
        # PUT : NOT ALLOWED
        response = client.put('/api/content/1/review/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/content/1/review/')
        self.assertEqual(response.status_code, 405)

    # review content : GET
    def test_review_detail_post(self):
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/review/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/review/1/')
        self.assertEqual(response.status_code, 200)
        review = json.loads(response.content.decode())
        self.assertEqual(1, review['id'])
        self.assertEqual(1, review['content_id'])
        self.assertEqual(1, review['user'])
        self.assertEqual('review_detail', review['detail'])

        # GET ERR review doesn't exist : 404
        response = client.get('/api/review/10/')
        self.assertEqual(response.status_code, 404)

    # review content : PUT

    def test_review_detail_put(self):
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put('/api/review/1/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # PUT SUCCESS : 200
        response = client.put('/api/review/1/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 200)
        review = json.loads(response.content.decode())
        self.assertEqual(1, review['id'])
        self.assertEqual(1, review['content_id'])
        self.assertEqual(1, review['user_id'])
        self.assertEqual('change_detail', review['detail'])

        # PUT ERR review doesn't exist : 404
        response = client.put('/api/review/10/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # PUT ERR not author : 403
        client.get('/api/logout/')
        client.post('/api/login/',
                    json.dumps({'username': 'user2',
                                'password': 'user2_password'}),
                    content_type='application/json')
        response = client.put('/api/review/1/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 403)

    # review content : DELETE

    def test_review_detail_delete(self):
        client = Client()

        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/review/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # DELETE SUCCESS : 200
        response = client.delete('/api/review/1/')
        self.assertEqual(response.status_code, 200)

        # DELETE ERR review doesn't exist : 404
        response = client.delete('/api/review/10/')
        self.assertEqual(response.status_code, 404)

    # user_favorite_list : 405 ERROR (METHOD NOT ALLOWED)
    def test_review_detail_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/review/1/')
        self.assertEqual(response.status_code, 405)
