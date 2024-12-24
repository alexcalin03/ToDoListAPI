from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
    id=models.AutoField(primary_key=True)
    name=models.CharField(max_length=100)
    user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def __str__(self):
        return self.name


class Todo(models.Model):
        id=models.AutoField(primary_key=True)
        title=models.CharField(max_length=100)
        description=models.TextField(blank=True, null=True)
        due_date=models.DateField(blank=True, null=True)
        priority=models.CharField(max_length=10, blank=True, null=True)
        project=models.ForeignKey(Project, on_delete=models.CASCADE)
        user=models.ForeignKey(User, on_delete=models.CASCADE, related_name='todos')

        def __str__(self):
            return self.title
