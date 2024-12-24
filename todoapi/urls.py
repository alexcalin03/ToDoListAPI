from django.urls import path
from .views import project_list, todo_list, register_user,logout_user, user_projects, user_todos, create_project, create_todo, delete_project, delete_todo,update_project, update_todo


urlpatterns = [
    path('projects/', project_list, name='project_list'),
    path('todos/', todo_list,name='todo_list'),
    path('register/', register_user, name='register_user'),
    path('logout/', logout_user, name='logout_user'),
    path('user_projects/', user_projects, name='user_projects'),
    path('user_todos/', user_todos, name='user_todos'),
    path('create_project/', create_project, name='create_project'),
    path('create_todo/', create_todo, name='create_todo'),
    path('delete_project/<int:project_id>/', delete_project, name='delete_project'),
    path('delete_todo/<int:todo_id>/', delete_todo, name='delete_todo'),
    path('update_project/<int:project_id>/', update_project, name='update_project'),
    path('update_todo/<int:todo_id>/', update_todo, name='update_todo'),
]




