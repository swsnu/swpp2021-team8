# Generated by Django 3.2.8 on 2021-12-11 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ott', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ott',
            name='ott',
            field=models.CharField(choices=[('Watcha', 'Watcha'), ('Netflix', 'Netflix'), ('Tving', 'Tving'), (
                'Youtube', 'Youtube'), ('Disney', 'Disney'), ('CoupangPlay', 'CoupangPlay'), ('Wavve', 'Wavve')], max_length=15),
        ),
    ]
