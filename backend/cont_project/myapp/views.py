# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password

from .models import User
from .serialize import *

@api_view(['GET', 'POST', 'PUT'])
def user(request):
    if request.method == 'GET' and request.query_params.get('email', '') != '' and not request.query_params.get('password', '') == '':
        email = request.query_params.get('email', '')
        try:
            user = User.objects.get(email=email)
            return Response({'message': 'User already exists'})
        except User.DoesNotExist:
             return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
    elif request.method == 'GET':
        data = User.objects.all()

        serializer = UserSerializer(data, context={'request': request}, many=True)

        return Response(serializer.data)

@api_view(['POST'])
def loginUser(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        password = request.data.get('pwd', '')
        # trim the password
        password = password.strip()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'})
        pwdCheck = user.check_password(password)
        print(pwdCheck)
        if pwdCheck:  
            serializers = UserSerializer(user, context={'request': request})
            serializers_data = serializers.data
            return Response({'message': 'Login successful', 'user': serializers_data}, status=status.HTTP_200_OK)
        elif not pwdCheck:
            print('Login failed')
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET', 'POST'])
def checkEmail(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        print(email)
        try:
            user = User.objects.get(email=email)
            print(user.email)
            print('Email not verified')
            if user:
                return Response({'message': 'User already exists'})
        except User.DoesNotExist:
            print('User not found')
            return Response({'message': 'User does not exist'})
         
@api_view(['POST'])
def addUser(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            password = make_password(request.data.get('pwd'))
            serializer.save(pwd=password)
            return Response({'message': 'OK'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'POST'])
def updateUser(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        password = request.data.get('newPassword', '')
        print(email)
        print(password)
        # trim the password
        password = password.strip()
        # check if user exists
        try:
            user = User.objects.get(email=email)
            print(user.email)
            print('User exists')
        except User.DoesNotExist:
            print('User does not exist')
            return Response({'message': 'User does not exist'})
        # reset password
        user.set_password(password)
        print(user.pwd)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'Password reset failed'}, status=status.HTTP_400_BAD_REQUEST)
