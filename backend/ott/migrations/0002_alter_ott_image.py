# Generated by Django 3.2.8 on 2021-12-07 12:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ott', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ott',
            name='image',
            field=models.ImageField(upload_to='public/img'),
        ),
    ]
