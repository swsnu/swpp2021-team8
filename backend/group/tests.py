import json
import tempfile
from django.contrib.auth.models import User
from django.test import TestCase, Client
from ott.models import Ott
from .models import Group


class GroupTestCase(TestCase):
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

        Group
        -----
            id  name        description         is_public   password    will_be_deleted membership  payday  account_back    account_name    account_number  leader  current_people
            ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
            1   group_name  group_description   True        -1          False           new_ott1    1       Woori           group1_account  1234            user1   1
            2   group_name  group_description   True        -1          False           new_ott2    1       Woori           group2_account  1234            user1   1

        """
        new_user1 = User.objects.create_user(
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
        response = self.logged_in_client.get('/api/user/token/')
        self.csrf_token = response.cookies['csrftoken'].value

        self.logged_in_client.post('/api/user/login/',
                                   json.dumps({'username': 'user1',
                                               'password': 'user1_password'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=self.csrf_token)

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

        # GET Request with query
        response = self.logged_in_client.get(
            '/api/group/?name=group&ott=watcha__standard')
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
            "willBeDeleted": self.new_group.will_be_deleted,
            "leader": {"id": 1, "username": "user1"},
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
        client.post('/api/user/login/',
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
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.delete('/api/group/1/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Group.objects.all().count(), 2)

        # DELETE ERR no article exists : 404
        response = client.delete('/api/group/10/')
        self.assertEqual(response.status_code, 404)

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
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')
        response = client.delete('/api/group/1/user/')
        self.assertEqual(response.status_code, 200)

        # DELETE ERR no group exists : 404
        response = client.delete('/api/group/5/user/')
        self.assertEqual(response.status_code, 404)
