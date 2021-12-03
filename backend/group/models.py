from django.db import models
from django.contrib.auth.models import User
from ott.models import Ott

# Create your models here.


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
