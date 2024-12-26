from django.contrib import admin
from .models import Project, Todo, Notification

admin.site.register(Project)
admin.site.register(Todo)
admin.site.register(Notification)

# Register your models here.
