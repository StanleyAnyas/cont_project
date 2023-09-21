# from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.contrib.auth.hashers import make_password, check_password
from django.core.mail import send_mail
from random import randint

from .models import User
from .models import UserToken
from .serialize import *

def get_random_number(length):
    min_value = 10 ** (length - 1)
    max_value = (10 ** length) - 1
    return randint(min_value, max_value)

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
        print(user)
        pwdCheck = user.check_password(password)
        print(pwdCheck)
        print(user.verified)
        if pwdCheck and user.verified:
            serializers = UserSerializer(user, context={'request': request})
            serializers_data = serializers.data
            return Response({'message': 'Login successful', 'user': serializers_data}, status=status.HTTP_200_OK)
        elif not pwdCheck:
            return Response({'message': 'Login failed'})
    return Response({'message': 'Login failed'})

@api_view(['GET', 'POST'])
def checkEmail(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        print(email)
        try:
            user = User.objects.get(email=email)
            if user and user.verified:
                return Response({'message': 'User already exists'})
        except User.DoesNotExist:
            print('User not found')
            return Response({'message': 'User does not exist'})
         
@api_view(['POST'])
def addUser(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        token = get_random_number(6)
        # send email
        send_mail(
            'Email Verification',
            'Your verification code is ' + str(token),
            'Please enter the code to verify your email',
            [email],
            fail_silently=False,
        )
        # store the token in the database with the email
        userToken = UserToken(email=email, token=token)
        userToken.save()
        # create user 
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            password = make_password(request.data.get('pwd'))
            serializer.save(pwd=password)
            return Response({'message': 'OK'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['POST'])
def resendToken(request):
    if request.method == 'POST':
        email = request.data.get('email')
        # check if the email already has a token
        try:
            userToken = UserToken.objects.get(email=email)
            if userToken:
                # delete the token
                userToken.delete()
        except UserToken.DoesNotExist:
            pass
        # generate a new token
        token = get_random_number(6)
        # send email
        send_mail(
            'Email Verification',
            'Your verification code is ' + str(token),
            'Please enter the code to verify your email',
            [email],
            fail_silently=False,
        )
        # store the token in the database with the email
        userToken = UserToken(email=email, token=token)
        userToken.save()
        return Response({'message': 'OK'}, status=status.HTTP_201_CREATED)
    return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def authUser(request):
    if request.method == 'POST':
        email = request.data.get('email')
        token = request.data.get('authCode')
        print(email)
        print(token)
        try:
            userToken = UserToken.objects.get(email=email, token=token)
            userToken.verified = True
            userToken.save()
            if userToken:
                # delete the token
                userToken.delete()
                # update the user as verified
                user = User.objects.get(email=email)
                if not user.verified:
                    user.verified = True
                    user.save()
            return Response({'message': 'Authentication successful'}, status=status.HTTP_200_OK)
        except UserToken.DoesNotExist:
            return Response({'message': 'Invalid token'})
    return Response({'message': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


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

@api_view(['POST'])
def sendToken(request):
    if request.method == 'POST':
        email = request.data.get('email', '')
        try:
            userToken = UserToken.objects.get(email=email)
            if userToken:
                # delete the token
                userToken.delete()
        except UserToken.DoesNotExist:
            pass
        token = get_random_number(6)
        # send email
        send_mail(
            'Password Reset',
            'Your password reset code is ' + str(token),
            'Please enter the code to reset your password',
            [email],
            fail_silently=False,
        )
        # store the token in the database with the email
        userToken = UserToken(email=email, token=token)
        userToken.save()
        return Response({'message': 'Token sent'})
    return Response({'message': 'Token not sent'})

@api_view(['POST'])
def verifyToken(request):
    if request.method == 'POST':
        email = request.data.get('email')
        token = request.data.get('token')
        print(email)
        print(token)
        try:
            userToken = UserToken.objects.get(email=email, token=token)
            if userToken:
                # delete the token
                userToken.delete()
            return Response({'message': 'Authentication successful'})
        except UserToken.DoesNotExist:
            return Response({'message': 'Invalid token'})
    return Response({'message': 'Invalid token'})
