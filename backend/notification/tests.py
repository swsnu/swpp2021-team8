import json
from django.test import TestCase, Client
from django.contrib.auth.models import User

from .models import Notification

# Create your tests here.
class NotificationTestCase(TestCase):
    def setUp(self):
        """
        User
            id  username    password
            ------------------------
            1   test        test
            2   test2       test2

        Notification
            id  receiver    content
            -----------------------
            1   test        group create
            2   test        group delete
            3   test        group payday
        """
        self.client = Client()

        user = User(username="test", password="test")
        user.save()
        User(username="test2", password="test2").save()

        Notification(receiver=user, content="group create").save()
        Notification(receiver=user, content="group delete").save()
        Notification(receiver=user, content="group payday").save()
    
    def test_get_notification(self):
        """
        GET /api/notification/
        """
        
        # when  URL doesn't have "user" query
        # then  Return 400 error
        response = self.client.get('/api/notification/')
        self.assertEqual(response.status_code, 400)

        # when  user does not exist
        # then  Return 404 error
        response = self.client.get('/api/notification/?user=10')
        self.assertEqual(response.status_code, 404)

        # when  user request notification
        # then  Return all notifications
        expect_result = [
            {"id": 1, "content": "group create"},
            {"id": 2, "content": "group delete"},
            {"id": 3, "content": "group payday"},
        ]
        response = self.client.get('/api/notification/?user=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), expect_result)

    def test_post_notification(self):
        """
        POST /api/notification/
        """

        # when  Receiver does not exist
        # then  Return 404 error
        response = self.client.post('/api/notification/', json.dumps({
            "receiver": 3,
            "content": "test content"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)
        
        # when  receiver and content is in body
        # then  Create a new notification
        expect_result = [
            {"id": 4, "content": "test content"},
        ]
        response = self.client.post('/api/notification/', json.dumps({
            "receiver": 2,
            "content": "test content"
        }), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.get('/api/notification/?user=2')
        self.assertEqual(json.loads(response.content.decode()), expect_result)

    def test_delete_notification(self):
        """
        DELETE /api/notification/
        """

        # when  Notification id does not exist
        # then  Return 404 error
        response = self.client.delete('/api/notification/', json.dumps({
            "receiver": 10,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        # when  Delete is successful, delete item 
        # then  Return 200 code
        expect_result = [
            {"id": 1, "content": "group create"},
            {"id": 2, "content": "group delete"},
        ]
        response = self.client.delete('/api/notification/', json.dumps({
            "receiver": 3,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/notification/?user=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), expect_result)
