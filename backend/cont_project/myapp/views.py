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
    
    elif request.method == 'PUT':
        # retrive the data from the request
        data = request.data
        print(data)
        email = data.get('email', '')
        password = data.get('pwd', '')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        # reset password
        user.pwd = make_password(password)
        user.save()
        return Response({'message': 'Password reset successful'}, status=status.HTTP_201_CREATED)

@api_view(['POST', 'GET'])
def loginUser(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        password = request.data.get('pwd', '')
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UserSerializer(user, context={'request': request})
        pwdCheck = check_password(password, serializer.data['pwd'])
        if pwdCheck:  
            return Response({'message': 'Login successful', 'user': serializer.data}, status=status.HTTP_200_OK)
        elif not pwdCheck:
            return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response({'message': 'Login failed'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def checkEmail(request):
    if request.method == 'GET':
        email = request.query_params.get('email', '')
        try:
            user = User.objects.get(email=email)
            if user:
                return Response({'message': 'User already exists'})
        except User.DoesNotExist:
             return Response({'message': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)
         
@api_view(['POST'])
def addUser(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            password = make_password(request.data.get('pwd'))
            serializer.save(pwd=password)
            return Response({'message': 'OK'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    