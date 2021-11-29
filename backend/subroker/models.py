from django.contrib.auth.models import User
from django.db import models


class Ott(models.Model):
    ott_type = (
        ('Watcha', 'Watcha'),
        ('Netflix', 'Netflix'),
        ('Tving', 'Tving'),
        ('Youtube', 'Youtube'),
        ('Disney', 'Disney'),
        ('Coupangplay', 'Coupangplay'),
        ('Wavve', 'Wavve')
    )
    ott = models.CharField(choices=ott_type, max_length=15)
    membership_type = (
        ('Basic', 'Basic'),
        ('Standard', 'Standard'),
        ('Premium', 'Premium')
    )
    membership = models.CharField(choices=membership_type, max_length=10)
    max_people = models.IntegerField(default=1)
    cost = models.IntegerField(default=0)
    image = models.ImageField(upload_to="ott_image")

    def __str__(self):
        name = self.ott + ' / ' + self.membership
        return name


class Group(models.Model):
    # Basic Group Settings
    name = models.CharField(max_length=64, default="New Group")
    description = models.TextField(default="")
    is_public = models.BooleanField(default=True)
    password = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    will_be_deleted = models.BooleanField(default=False)

    # Membership Settings
    membership = models.ForeignKey(
        Ott,
        on_delete=models.CASCADE,
        related_name='membership_groups'
    )

    # Payment Settings
    payday = models.IntegerField(default=1)
    account_bank_type = (
        ('NongHyup', 'NongHyup'),
        ('KookMin', 'KookMin'),
        ('KakaoBank', 'KakaoBank'),
        ('ShinHan', 'ShinHan'),
        ('Woori', 'Woori'),
        ('IBK', 'IBK'),
        ('Hana', 'Hana'),
        ('Saemaeul', 'Saemaeul'),
        ('DaegooBank', 'DaegooBank'),
        ('PostOffice', 'PostOffice'),
        ('Toss', 'Toss'),
        ('CitiBank', 'CitiBank'),
        ('KDB', 'KDB')
    )
    account_bank = models.CharField(choices=account_bank_type, max_length=15)
    account_number = models.CharField(max_length=20)
    account_name = models.CharField(max_length=30)

    # People
    leader = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='group_leader'
    )
    members = models.ManyToManyField(
        User,
        blank=True,
        related_name='user_groups'
    )
    current_people = models.IntegerField(default=1)

    def __str__(self):
        name = str(self.id) + ' / ' + self.membership.ott
        return name


class Content(models.Model):
    favorite_cnt = models.IntegerField(default=0)
    favorite_users = models.ManyToManyField(
        User,
        blank=True,
        related_name='favorite_contents'
    )

    def __str__(self):
        content_id = str(self.id)
        return content_id


class Review(models.Model):
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name='content_reviews'
    )
    detail = models.TextField(default="")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_reviews'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.detail
