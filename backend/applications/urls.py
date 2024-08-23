from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    path('', views.ApplicationList.as_view(), name='index'),
    path('<int:pk>/', views.ApplicationDetail.as_view(), name='detail'),
    path('<int:pk>/comments/', views.ApplicationCommentList.as_view(), name='comments'),
    path('<int:pk>/comments/<int:comment_id>', views.ApplicationCommentDetail.as_view(), name='comment_detail'),
    path('students/', views.StudentList.as_view(), name='student'),
    path('students/<int:pk>', views.StudentDetail.as_view(), name='student_detail'),
    path('students/<int:pk>/applications/', views.StudentApplicationList.as_view(), name='student_applications'),
    path('students/<int:pk>/applications/<int:app_id>', views.StudentApplicationDetail.as_view(),
         name='student_application_detail'),
    path('prefetch/', views.ApplicationListPrefetch.as_view(), name='prefetch'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
