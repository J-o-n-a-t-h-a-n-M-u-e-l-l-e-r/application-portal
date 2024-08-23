from django.contrib import admin

from .models import Application, Comment, ApplicationFile

admin.site.register(Application)
admin.site.register(ApplicationFile)
admin.site.register(Comment)
