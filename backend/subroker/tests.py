import json
import tempfile
from django.contrib.auth.models import User
from django.test import TestCase, Client
from .models import Review, Content, Group, Ott

# Create your tests here.
class SubrokerTestCase(TestCase):
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

        Content
        -------
            id      favorite_cnt    favorite_users
            ----------------------------------
            1       0               []
            2       1               [1]
            68718   1               [1]

        Review
        ------
            id  content     detail          user
            ------------------------------------
            1   content_1   review_detail   1

        Group
        -----
            id  name        description         is_public   password    will_be_deleted membership  payday  account_back    account_name    account_number  leader  current_people
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            1   group_name  group_description   True        -1          False           new_ott1    1       Woori           group1_account  1234            user1   1
            2   group_name  group_description   True        -1          False           new_ott2    1       Woori           group2_account  1234            user1   1

        """
        new_user1 = User.objects.create_user(username='user1', password='user1_password')  # Django default user model
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

        new_content = Content(favorite_cnt=0)
        new_content.save()
        new_content2 = Content(favorite_cnt=1)
        new_content2.save()
        new_content2.favorite_users.add(new_user1)
        new_content2.save()

        new_content3 = Content(id=68718,favorite_cnt=1)
        new_content3.save()
        new_content3.favorite_users.add(new_user1)
        new_content3.save()

        new_review = Review(content=new_content,
                            detail='review_detail', user=new_user1)
        new_review.save()

        self.new_group = Group(
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
        self.new_group.save()

        self.new_group2 = Group(
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
        self.new_group2.save()

        self.logged_in_client = Client()
        response = self.logged_in_client.get('/api/token/')
        self.csrf_token = response.cookies['csrftoken'].value

        self.logged_in_client.post('/api/login/',
                               json.dumps({'username': 'user1',
                                           'password': 'user1_password'}),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=self.csrf_token)

    def test_csrf(self):
        """
        /api/token/

        By default, csrf checks are disabled in test client
        To test csrf protection we enforce csrf checks here
        """
        client = Client(enforce_csrf_checks=True)
        response = client.post('/api/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json')

        self.assertEqual(response.status_code, 403) # CSRF Token Error

        response = client.get('/api/token/')
        # Get csrf token from cookie
        csrftoken = response.cookies['csrftoken'].value

        response = client.post('/api/signup/',
                               json.dumps({'username': 'chris',
                                           'password': 'chris'}),
                               content_type='application/json',
                               HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(response.status_code, 201)  # Pass csrf protection

    def test_token_405(self):
        """
        /api/token/

        POST, PUT, DELETE are not allowed
        """
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

    def test_user(self):
        """
        /api/user/
        """
        client = Client()

        # user is not logged in
        response = client.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), {"id": "", "username": "","isLoggedIn": False, "notDeletedGroupCount" : 0, "deletedGroupCount": 0})

        # user is logged in
        response = self.logged_in_client.get('/api/user/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), {"id": 1, "username": "user1", "isLoggedIn": True, "notDeletedGroupCount" : 2, "deletedGroupCount": 0})

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
        /api/signup/
        """
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


    def test_signup_405(self):
        """
        /api/signup/

        GET, PUT, DELETE are not allowed
        """

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

    def test_login(self):
        """
        /api/login/
        """

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

    def test_login_405(self):
        """
        /api/login/

        GET, PUT, DELETE are not allowed
        """
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

    def test_logout(self):
        """
        /api/logout/
        """
        response = self.logged_in_client.get('/api/logout/')
        self.assertEqual(response.status_code, 204)

        # GET ERR unauthorized user request : 401
        response = self.logged_in_client.get('/api/logout/')
        self.assertEqual(response.status_code, 401)

    def test_logout_405(self):
        """
        /api/logout/

        POST, PUT, DELETE are not allowed
        """
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

    def test_group_list_get(self):
        """
        /api/group/

        Get group list
        """
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/group/')
        self.assertEqual(response.status_code, 401)

        # GET SUCCESS : 200
        response = self.logged_in_client.get('/api/group/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())[0]

        self.assertEqual(group, {
            'id': self.new_group.id,
            'platform': self.new_group.membership.ott,
            'membership': self.new_group.membership.membership,
            'name': self.new_group.name,
            'leader': self.new_group.leader.username,
            'cost': self.new_group.membership.cost,
            'currentPeople': self.new_group.current_people,
            'maxPeople': self.new_group.membership.max_people,
            'payday': self.new_group.payday
        })

        # GET Request with query
        response = self.logged_in_client.get('/api/group/?name=group&ott=watcha__standard')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())[0]

        self.assertEqual(group, {
            'id': self.new_group2.id,
            'platform': self.new_group2.membership.ott,
            'membership': self.new_group2.membership.membership,
            'name': self.new_group2.name,
            'leader': self.new_group2.leader.username,
            'cost': self.new_group2.membership.cost,
            'currentPeople': self.new_group2.current_people,
            'maxPeople': self.new_group2.membership.max_people,
            'payday': self.new_group2.payday
        })

    def test_group_list_post(self):
        """
        /api/group/

        make a new group
        """
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

        # POST SUCCESS : 201
        response = self.logged_in_client.post('/api/group/', json.dumps({
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
        response = self.logged_in_client.post('/api/group/', json.dumps({
            "name": "Watchaas",
            "description": "This group is for watchaaaas",
            "isPublic": "True",
            "password": "-1",
            "membership": "50",
            "payday": "13",
            "accountBank": "Woori",
            "accountNumber": "1002-550-123445",
            "accountName": "Hyeju Na",
            "ottPlanId": 3
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_group_list_405(self):
        """
        /api/group/

        PUT, DELETE are not allowed
        """
        client = Client()
        # PUT : NOT ALLOWED
        response = client.put('/api/group/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/group/')
        self.assertEqual(response.status_code, 405)

    def test_group_detail_get(self):
        """
        /api/group/<int:group_id>/

        GET
        """
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/group/1/')
        self.assertEqual(response.status_code, 401)

        # GET SUCCESS : 200
        response = self.logged_in_client.get('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        group = json.loads(response.content.decode())

        self.assertEqual(group, {
            "id": self.new_group.id,
            "name": self.new_group.name,
            "platform": self.new_group.membership.ott,
            "membership": self.new_group.membership.membership,
            "isPublic": self.new_group.is_public,
            "password": self.new_group.password,
            "cost": self.new_group.membership.cost,
            "maxPeople": self.new_group.membership.max_people,
            "currentPeople": self.new_group.current_people,
            "members": [],
            "accountBank": self.new_group.account_bank,
            "accountNumber": self.new_group.account_number,
            "accountName": self.new_group.account_name,
            "description": self.new_group.description,
            "payday": self.new_group.payday,
            "leader": { "id": 1, "username": "user1"},
        })

        # GET ERR group doesn't exist : 404
        response = self.logged_in_client.get('/api/group/10/')
        self.assertEqual(response.status_code, 404)

    def test_group_detail_put(self):
        """
        /api/group/<int:group_id>/

        PUT
        """
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put(
            '/api/review/1/', content_type='application/json')
        self.assertEqual(response.status_code, 401)


        # PUT SUCCESS : 200
        response = self.logged_in_client.put('/api/group/1/', json.dumps({
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

        self.assertEqual(group, {
            "id": self.new_group.id,
            "name": "name_change",
            "description": "description_change",
            "isPublic": "False",
            "password": "1234",
            "accountBank": "IBK",
            "accountNumber": "1234",
            "accountName": "account_name_change",
            "leader": self.new_group.leader.id,
            "currentPeople": self.new_group.current_people,
        })

        # PUT ERR group doesn't exist : 404
        response = self.logged_in_client.put('/api/group/10/', json.dumps({
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

    def test_group_detail_delete(self):
        """
        /api/group/<int:group_id>/

        DELETE
        """
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

    def test_group_detail_405(self):
        """
        /api/group/<int:group_id>/

        POST is not allowed
        """
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/group/10/')
        self.assertEqual(response.status_code, 405)

    def test_group_add_user_put(self):
        """
        /api/group/<int:group_id>/user/

        PUT
        """
        client = Client()
        # PUT ERR unauthorized user request : 401
        response = client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        # PUT SUCCESS : 200
        response = self.logged_in_client.put('/api/group/2/user/')
        self.assertEqual(response.status_code, 200)

        # PUT ERR no group exists : 404
        response = self.logged_in_client.put('/api/group/10/user/')
        self.assertEqual(response.status_code, 404)

        # PUT ERR group is full : 400
        response = self.logged_in_client.put('/api/group/1/user/')
        self.assertEqual(response.status_code, 400)

    def test_group_add_user_delete(self):
        """
        /api/group/<int:group_id>/user/

        DELETE
        """
        client = Client()
        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 401)

        # DELETE SUCCESS : 200
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 200)

        # DELETE ERR no group exists : 404
        response = client.delete('/api/group/5/user/')
        self.assertEqual(response.status_code, 404)

    def test_group_add_user_405(self):
        """
        /api/group/<int:group_id>/user/

        GET, POST
        """
        client = Client()
        # GET : NOT ALLOWED
        response = client.get('/api/group/1/user/')
        # POST : NOT ALLOWED
        response = client.post('/api/group/1/user/')
        self.assertEqual(response.status_code, 405)

    def test_ott_list(self):
        """
        /api/ott/

        GET
        """
        client = Client()
        response = client.put('/api/ott/')
        self.assertEqual(response.status_code, 405)
        response = client.get('/api/ott/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/login/',
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
        response = client.put('/api/ott/watcha_basic/')
        self.assertEqual(response.status_code, 405)
        response = client.get('/api/ott/watcha_basic/')
        self.assertEqual(response.status_code, 401)
        client.post('/api/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.get('/api/ott/watchu_basic/')
        self.assertEqual(response.status_code, 404)
        response = client.get('/api/ott/watcha_basic/')
        self.assertEqual(response.status_code, 200)

    def test_content_search(self):
        """
        /api/content/search/<str:search_str>/

        GET
            Receive search list from The movie API
        """

        response = self.logged_in_client.get('/api/content/search/avatar/')
        self.assertEqual(response.status_code, 200)

    def test_content_detail(self):
        """
        /api/content/<int:content_id>/

        GET
            Get Content detail information from THE MOVIE API
        """
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
        response = client.get('/api/content/566525/')
        self.assertEqual(response.status_code, 200)


    def test_content_detail_405(self):
        """
        /api/content/<int:content_id>/

        POST, PUT, DELETE are now allowed
        """
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/content/1/')
        self.assertEqual(response.status_code, 405)

        # PUT : NOT ALLOWED
        response = client.put('/api/content/1/')
        self.assertEqual(response.status_code, 405)

        # DELETE : NOT ALLOWED
        response = client.delete('/api/content/1/')
        self.assertEqual(response.status_code, 405)

    def test_content_recommendation(self):
        """
        /api/content/<int:user_id>/recommendation/

        GET
            Get recommended contents for current user from THE MOIVE API
        """
        response = self.logged_in_client.get('/api/content/1/recommendation/')
        self.assertEqual(response.status_code, 200)

        response = self.logged_in_client.get('/api/content/2/recommendation/')
        self.assertEqual(response.status_code, 200)

        response = self.logged_in_client.get('/api/content/3/recommendation/')
        self.assertEqual(response.status_code, 404)

    def test_user_favorite_list_get(self):
        """
        /api/content/<int:user_id>/favorite/

        GET
            Get favorite contents for user_id
        """
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

    def test_user_favorite_list_405(self):
        """
        /api/content/<int:user_id>/favorite/

        POST, PUT, DELETE are not allowed
        """
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

        # PUT ERR fav content doesn't exist : 404
        response = client.put('/api/content/2/favorite/10/')
        self.assertEqual(response.status_code, 404)

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
        self.assertEqual(response.status_code, 404)

    # content_favorite_list : 405 ERROR (METHOD NOT ALLOWED)
    def test_content_favorite_405(self):
        client = Client()
        # POST : NOT ALLOWED
        response = client.post('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 405)

        # GET : NOT ALLOWED
        response = client.get('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 405)

    def test_content_trending(self):
        """
        /api/content/trending/

        GET
        """
        response = self.logged_in_client.get('/api/content/trending/')
        self.assertEqual(response.status_code, 200)

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

    # review content : POST
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
