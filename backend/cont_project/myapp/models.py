from django.db import models

class User(models.Model):
    firstname = models.CharField(db_column='firstName', max_length=255, blank=True, null=True)  # Field name made lowercas # Field name made lowercase.
    email = models.CharField(max_length=225, blank=True, null=True)
    pwd = models.CharField(max_length=225, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'user'