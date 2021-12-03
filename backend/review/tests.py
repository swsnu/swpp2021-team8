import json
from django.contrib.auth.models import User
from django.test import TestCase, Client
from content.models import Content
from .models import Review


class ReviewTestCase(TestCase):
    def setUp(self):
        """
        SetUp DB for test

        User
        ----
            id  username    password
            ------------------------
            1   user1       user1_password
            2   user2       user2_password

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
        """
        new_user1 = User.objects.create_user(
            username='user1', password='user1_password')  # Django default user model
        User.objects.create_user(username='user2', password='user2_password')

        new_content = Content(favorite_cnt=0)
        new_content.save()
        new_content2 = Content(favorite_cnt=1)
        new_content2.save()
        new_content2.favorite_users.add(new_user1)
        new_content2.save()

        new_content3 = Content(id=68718, favorite_cnt=1)
        new_content3.save()
        new_content3.favorite_users.add(new_user1)
        new_content3.save()

        new_review = Review(content=new_content,
                            detail='review_detail', user=new_user1)
        new_review.save()

        self.logged_in_client = Client()
        self.logged_in_client.post('/api/user/login/',
                                   json.dumps({'username': 'user1',
                                               'password': 'user1_password'}),
                                   content_type='application/json')

    def test_review_detail_get(self):
        """
        /api/review/<int:review_id>/

        GET
        """
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/review/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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
        """
        /api/review/<int:review_id>/

        PUT
        """
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put('/api/review/1/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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
        client.post('/api/user/login/',
                    json.dumps({'username': 'user2',
                                'password': 'user2_password'}),
                    content_type='application/json')
        response = client.put('/api/review/1/',
                              json.dumps({'detail': 'change_detail'}),
                              content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_review_detail_delete(self):
        """
        /api/review/<int:review_id>/

        DELETE
        """
        client = Client()

        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/review/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # DELETE SUCCESS : 200
        response = client.delete('/api/review/1/')
        self.assertEqual(response.status_code, 200)

        # DELETE ERR review doesn't exist : 404
        response = client.delete('/api/review/10/')
        self.assertEqual(response.status_code, 404)
