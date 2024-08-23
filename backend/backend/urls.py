"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

from .media_view import serve_media


def health_check(request):
    return HttpResponse("OK", status=200)


urlpatterns = [
    path('', health_check, name='health_check'),
    path('applications/', include('applications.urls')),
    path('auth/', include('authentication.urls')),
    path('admin/', admin.site.urls),
    path('media/<path:path>/', serve_media, name='serve_media'),
]

if settings.DEBUG:
    urlpatterns += [path(settings.MEDIA_URL.lstrip("/"), serve_media)]
else:
    urlpatterns += [
        path(f'{settings.MEDIA_URL.lstrip("/")}/<path:path>/', serve_media),
    ]
