# Generated by Django 3.2.6 on 2021-12-09 16:53

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('ott', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='New Group', max_length=64)),
                ('description', models.TextField(default='')),
                ('is_public', models.BooleanField(default=True)),
                ('password', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('will_be_deleted', models.BooleanField(default=False)),
                ('payday', models.IntegerField(default=1)),
                ('account_bank', models.CharField(choices=[('NongHyup', 'NongHyup'), ('KookMin', 'KookMin'), ('KakaoBank', 'KakaoBank'), ('ShinHan', 'ShinHan'), ('Woori', 'Woori'), ('IBK', 'IBK'), ('Hana', 'Hana'), ('Saemaeul', 'Saemaeul'), ('DaegooBank', 'DaegooBank'), ('PostOffice', 'PostOffice'), ('Toss', 'Toss'), ('CitiBank', 'CitiBank'), ('KDB', 'KDB')], max_length=15)),
                ('account_number', models.CharField(max_length=20)),
                ('account_name', models.CharField(max_length=30)),
                ('current_people', models.IntegerField(default=1)),
                ('leader', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_leader', to=settings.AUTH_USER_MODEL)),
                ('members', models.ManyToManyField(blank=True, related_name='user_groups', to=settings.AUTH_USER_MODEL)),
                ('membership', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='membership_groups', to='ott.ott')),
            ],
        ),
    ]
