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
@permission_classes([IsAuthenticated])
def user_projects(request):
    projects = Project.objects.filter(user=request.user).values('id','name')
    return Response(projects)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_todos(request):
    todos = Todo.objects.filter(project__user=request.user).values()
    return Response(todos)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project(request):
    name = request.data.get('name')
    if not name:
        return Response({'error':'Name is required'}, status=status.HTTP_400_BAD_REQUEST)
    project = Project.objects.create(name=name, user=request.user)
    return Response({'message':'Project created'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_todo(request):
    title = request.data.get('title')
    description = request.data.get('description','')
    due_date = request.data.get('due_date',None)
    priority = request.data.get('priority','')
    project = request.data.get('project')
    if not title:
        return Response({'error':'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        project = Project.objects.get(id=project, user=request.user)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)

    todo = Todo.objects.create(title=title, description=description, due_date=due_date, priority=priority,
                               project=project, user=request.user)
    return Response({
        'message': 'Todo created successfully',
        'todo': {
            'id': todo.id,
            'title': todo.title,
            'description': todo.description,
            'due_date': todo.due_date,
            'priority': todo.priority,
            'project': todo.project.id,
            'user': todo.user.id,
        }
    }, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id, user=request.user)
    except Project.DoesNotExist:
        return Response({'error':'Project not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)
    project.delete()
    return Response({'message':'Project deleted successfully'}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_todo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
    except Todo.DoesNotExist:
        return Response({'error':'Todo not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)
    todo.delete()
    return Response({'message':'Todo deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project(request, project_id):
    try:
        project = Project.objects.get(id=project_id, user=request.user)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)

    name = request.data.get('name')
    if not name or not isinstance(name, str):
        return Response({'error': 'Valid project name is required'}, status=status.HTTP_400_BAD_REQUEST)

    project.name = name
    try:
        project.save()
    except Exception as e:
        return Response({'error': 'Failed to update project'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'Project updated successfully'}, status=status.HTTP_200_OK)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_todo(request, todo_id):
    try:
        todo = Todo.objects.get(id=todo_id, user=request.user)
    except Todo.DoesNotExist:
        return Response({'error': 'Todo not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)

    title = request.data.get('title')
    description = request.data.get('description')
    due_date = request.data.get('due_date')
    priority = request.data.get('priority')
    project = request.data.get('project')

    if title and isinstance(title, str):
        todo.title = title
    if description and isinstance(description, str):
        todo.description = description
    if due_date:
        todo.due_date = due_date
    if priority and isinstance(priority, str):
        todo.priority = priority
    if project:
        try:
            project = Project.objects.get(id=project, user=request.user)
            todo.project = project
        except Project.DoesNotExist:
            return Response({'error': 'Project not found or does not belong to the user'}, status=status.HTTP_404_NOT_FOUND)

    try:
        todo.save()
    except Exception as e:
        return Response({'error': 'Failed to update todo'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'message': 'Todo updated successfully'}, status=status.HTTP_200_OK)

# Create your views here.
