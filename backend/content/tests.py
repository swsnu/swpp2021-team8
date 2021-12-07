import json
from django.contrib.auth.models import User
from django.test import TestCase, Client
from review.models import Review
from .models import Content, Genre


class ContentTestCase(TestCase):
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

        Genre.objects.create( name = 'Action' )
        Genre.objects.create( name = 'Adventure' )
        Genre.objects.create( name = 'Animation' )
        Genre.objects.create( name = 'Comedy' )
        Genre.objects.create( name = 'Crime' )
        Genre.objects.create( name = 'Documentary' )
        Genre.objects.create( name = 'Drama' )
        Genre.objects.create( name = 'Family' )
        Genre.objects.create( name = 'Fantasy' )
        Genre.objects.create( name = 'History' )
        Genre.objects.create( name = 'Horror' )
        Genre.objects.create( name = 'Music' )
        Genre.objects.create( name = 'Mystery' )
        Genre.objects.create( name = 'Romance' )
        Genre.objects.create( name = 'Science Fiction' )
        Genre.objects.create( name = 'TV Movie' )
        Genre.objects.create( name = 'Thriller' )
        Genre.objects.create( name = 'War' )
        Genre.objects.create( name = 'Western' )

        self.logged_in_client = Client()
        response = self.logged_in_client.get('/api/user/token/')
        self.csrf_token = response.cookies['csrftoken'].value

        self.logged_in_client.post('/api/user/login/',
                                   json.dumps({'username': 'user1',
                                               'password': 'user1_password'}),
                                   content_type='application/json',
                                   HTTP_X_CSRFTOKEN=self.csrf_token)

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
        client.post('/api/user/login/',
                    json.dumps({'username': 'user1',
                                'password': 'user1_password'}),
                    content_type='application/json')

        # GET SUCCESS : 200
        response = client.get('/api/content/566525/')
        self.assertEqual(response.status_code, 200)

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
        client.post('/api/user/login/',
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


    def test_content_favorite_put(self):
        """
        /api/content/<int:user_id>/favorite/<int:content_id>/

        PUT
        """
        client = Client()

        # PUT ERR unauthorized user request : 401
        response = client.put('/api/content/1/favorite/1/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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

    def test_content_favorite_delete(self):
        """
        /api/content/<int:user_id>/favorite/<int:content_id>/

        DELETE
        """
        client = Client()

        # DELETE ERR unauthorized user request : 401
        response = client.delete('/api/content/1/favorite/2/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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

    def test_content_trending(self):
        """
        /api/content/trending/

        GET
        """
        response = self.logged_in_client.get('/api/content/trending/')
        self.assertEqual(response.status_code, 200)

    def test_review_content_get(self):
        """
        /api/content/<int:content_id>/review/

        GET
        """
        client = Client()

        # GET ERR unauthorized user request : 401
        response = client.get('/api/content/1/review/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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

    def test_review_content_post(self):
        """
        /api/content/<int:content_id>/review/

        GET
        """
        client = Client()

        # POST ERR unauthorized user request : 401
        response = client.post('/api/content/1/review/')
        self.assertEqual(response.status_code, 401)

        # login
        client.post('/api/user/login/',
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
