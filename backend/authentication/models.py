from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone


class Person(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    birth_date = models.DateField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.first_name + " " + self.last_name

    class Meta:
        abstract = True
        ordering = ['created_at']


class Student(Person):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile', primary_key=True)
    phone = models.CharField(max_length=50)
    address = models.TextField()
    current_degree = models.CharField(max_length=50)


class Staff(Person):
    user_id = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile', primary_key=True)
    position = models.CharField(max_length=50)
    department = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        self.user_id.is_staff = True
        self.user_id.save()
        super().save(*args, **kwargs)
