# Generated by Django 3.2.8 on 2021-11-27 16:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('subroker', '0002_auto_20211123_0715'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ott',
            name='ott',
            field=models.CharField(choices=[('Watcha', 'Watcha'), ('Netflix', 'Netflix'), ('Tving', 'Tving'), ('Youtube', 'Youtube'), ('Disney', 'Disney'), ('Coupangplay', 'Coupangplay'), ('Wavve', 'Wavve')], max_length=15),
        ),
    ]
