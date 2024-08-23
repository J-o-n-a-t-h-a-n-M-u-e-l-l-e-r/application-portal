from django.contrib import admin

from authentication.models import Student, Staff

admin.site.register(Staff)
admin.site.register(Student)
