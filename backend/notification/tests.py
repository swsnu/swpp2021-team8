from datetime import datetime
from unittest import mock
import json
import pytz
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

        self.mocked_time = datetime(2018, 4, 4, 0, 0, 0, tzinfo=pytz.utc)
        self.return_time = '2018-04-04T00:00:00Z'
        with mock.patch('django.utils.timezone.now', mock.Mock(return_value=self.mocked_time)):
            Notification(receiver=user, type="create", content="group create").save()
            Notification(receiver=user, type="delete", content="group delete").save()
            Notification(receiver=user, type="payday", content="group payday").save()

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
            {"id": 1, "type": "create", "content": "group create", "created_at": self.return_time},
            {"id": 2, "type": "delete", "content": "group delete", "created_at": self.return_time},
            {"id": 3, "type": "payday", "content": "group payday", "created_at": self.return_time},
        ]
        response = self.client.get('/api/notification/?user=1')
        self.assertEqual(response.status_code, 200)
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
            {"id": 1, "type": "create", "content": "group create", "created_at": self.return_time},
            {"id": 2, "type": "delete", "content": "group delete", "created_at": self.return_time},
        ]
        response = self.client.delete('/api/notification/', json.dumps({
            "receiver": 3,
        }), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/notification/?user=1')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.content.decode()), expect_result)
