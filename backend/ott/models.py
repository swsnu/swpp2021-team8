from django.db import models

# Create your models here.


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
