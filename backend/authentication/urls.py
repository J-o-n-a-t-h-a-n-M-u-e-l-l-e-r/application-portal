from django.urls import path
from knox import views as knox_views
from rest_framework.urlpatterns import format_suffix_patterns

from .views import CreateUserView, ManageUserView, LoginView

urlpatterns = [
    path('register/', CreateUserView.as_view(), name="register"),
    path('profile/', ManageUserView.as_view(), name='profile'),
    path('login/', LoginView.as_view(), name='knox_login'),
    path('logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
