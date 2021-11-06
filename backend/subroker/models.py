from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Ott(models.Model):
    ott_type = (
        ('Watcha', 'Watcha'), 
        ('Netflix', 'Netflix'), 
        ('Tving', 'Tving'), 
        ('Youtube', 'Youtube'), 
        ('Disney', 'Disney'), 
        ('CoupangPlay', 'CoupangPlay'), 
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
    
    def __str__(self):
        name = self.ott + ' / ' + self.membership
        return name

class Group(models.Model):
    #Basic Group Settings
    name = models.CharField(max_length= 64, default="New Group")    
    description = models.TextField(default="")
    is_public = models.BooleanField(default=True)
    password = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    will_be_deleted = models.BooleanField(default=False)

    #Membership Settings
    ott_type = (
        ('Watcha', 'Watcha'), 
        ('Netflix', 'Netflix'), 
        ('Tving', 'Tving'), 
        ('Youtube', 'Youtube'), 
        ('Disney', 'Disney'), 
        ('CoupangPlay', 'CoupangPlay'), 
        ('Wavve', 'Wavve')
        )
    ott = models.CharField(choices=ott_type, max_length=15)
    membership = models.ForeignKey(
        Ott,
        on_delete=models.CASCADE,
        related_name='membership_set'
    )

    #Payment Settings
    payday = models.IntegerField(default=1)
    account_bank_type = (
        ('NH', 'NongHyup'),
        ('KB', 'KookMin'),
        ('KAKAO', 'Kakao'),
        ('SH', 'ShinHan'),
        ('WR', 'Woori'), 
        ('IBK', 'IBK'),
        ('HN', 'Hana'),
        ('SM', 'Saemaeul'), 
        ('DGB', 'Daegoo Bank'),
        ('POST', 'PostOffice'),
        ('TOSS', 'Toss'),
        ('CITI', 'CitiBank'),
        ('KDB', 'KDB')
    )
    account_bank = models.CharField(choices=account_bank_type, max_length=5)
    account_number = models.CharField(max_length=20)
    account_name = models.CharField(max_length=30)

    #People
    leader = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='leader_set'
    )
    members = models.ManyToManyField(
        User,
        blank = True,
        related_name='members'
    )
    current_people = models.IntegerField(default=1)

    def __str__(self):
        name = str(self.id) + ' / ' + self.ott
        return name


class Content(models.Model):
    the_movie_id = models.IntegerField(default=0)    
    name = models.CharField(default="", max_length=200)
    favorite_cnt = models.IntegerField(default=0)
    user_id = models.ManyToManyField(
        User,
        blank  = True,
        related_name='like_users_set'
    )
    def __str__(self):
        return self.name


class Review(models.Model):
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name='reviewed_content_set'
    )
    detail = models.TextField(default="")
    user_id = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='review_users_set'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.detail