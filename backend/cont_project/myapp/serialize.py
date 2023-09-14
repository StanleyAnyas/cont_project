from rest_framework import serializers
from .models import User
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)
        
        # Check if 'request' exists in the context
        if 'request' in self.context:
            if self.context['request'].method == 'GET':
                # For GET requests, make the 'id' field required
                self.fields['id'].required = True
            elif self.context['request'].method == 'POST':
                self.fields['id'].pop()
                # hash the password
                self.fields['pwd'] = make_password(self.fields['pwd'])