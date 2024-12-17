from django.urls import path
from .views import project_list, todo_list, register_user,logout_user

urlpatterns = [
    path('projects/', project_list, name='project_list'),
    path('todos/', todo_list,name='todo_list'),
    path('register/', register_user, name='register_user'),
    path('logout/', logout_user, name='logout_user'),
]




