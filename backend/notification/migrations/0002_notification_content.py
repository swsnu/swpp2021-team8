# Generated by Django 3.2.6 on 2021-12-10 16:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='content',
            field=models.CharField(default='', max_length=200),
        ),
    ]
