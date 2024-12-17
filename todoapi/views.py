from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.models import User
from .models import Project, Todo

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def project_list(request):
    projects = Project.objects.all().values()
    return Response(projects)

@api_view(['GET'])
def todo_list(request):
    todos = Todo.objects.all().values()
    return Response(todos)

@api_view(['POST'])
def register_user(request):
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email','')
    if User.objects.filter(username=username).exists():
        return Response({'error':'User already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message':'User created'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    request.user.auth_token.delete()
    return Response({'message':'User logged out'}, status=status.HTTP_200_OK)


# Create your views here.
