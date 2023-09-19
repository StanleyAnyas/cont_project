from django.db import models
from django.contrib.auth.hashers import make_password, check_password

class User(models.Model):
    firstname = models.CharField(db_column='firstName', max_length=255, blank=True, null=True)  # Field name made lowercas # Field name made lowercase.
    email = models.CharField(max_length=225, blank=True, null=True)
    pwd = models.CharField(max_length=225, blank=True, null=True)
    def set_password(self, password):
        self.pwd = make_password(password)
        
    def check_password(self, password):
        print(self.pwd)
        print(password)
        return check_password(password, self.pwd) # type: ignore
    # def save(self, *args, **kwargs):
    #     # Hash the password before saving
    #     if self.pwd:
    #         self.pwd = make_password(self.pwd)
    #     super().save(*args, **kwargs)
    class Meta:
        managed = False
        db_table = 'user'