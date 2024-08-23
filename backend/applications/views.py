import os

from knox.auth import TokenAuthentication
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.permissions import IsStaffMember
from constants import PAGE_SIZE
from .models import Application, Student, Comment, ApplicationFile
from .serializers import ApplicationSerializer, StudentSerializer, CommentSerializer, \
    PostApplicationSerializer


class ApplicationList(APIView):
    """
    List all applications
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get(self, request, format=None):
        applications = Application.objects.all()
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(applications, request)
        if page is not None:
            serializer = ApplicationSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class ApplicationDetail(APIView):
    """
    Retrieve, update or delete an application instance.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get_object(self, pk):
        return get_object_or_404(Application, pk=pk)

    def get(self, request, pk, format=None):
        application = self.get_object(pk)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        application = self.get_object(pk)
        serializer = ApplicationSerializer(application, data=request.data)
        if serializer.is_valid():
            serializer.save()
            files = request.FILES.getlist('files')
            for file in files:
                ApplicationFile.objects.create(application=application, file=file)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        application = self.get_object(pk)
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentList(APIView):
    """
    List all students, or create a new student.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get(self, request, format=None):
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentDetail(APIView):
    """
    Retrieve, update or delete a student instance.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get_object(self, pk):
        return get_object_or_404(Student, pk=pk)

    def get(self, request, pk, format=None):
        student = self.get_object(pk)
        serializer = StudentSerializer(student)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        student = self.get_object(pk)
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        student = self.get_object(pk)
        student.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class StudentApplicationList(APIView):
    """
    List all applications for a student, or create a new application for a student.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request, pk, format=None):
        applications = Application.objects.filter(student=pk)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        data = {k: v for k, v in request.data.items()}
        student = get_object_or_404(Student, pk=pk)
        data['student'] = student.user_id
        serializer = PostApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            files = request.FILES.getlist('files')
            for file in files:
                ApplicationFile.objects.create(application=serializer.instance, file=file)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StudentApplicationDetail(APIView):
    """
    Retrieve, update or delete an application for a student instance.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get_object(self, pk, app_id):
        return get_object_or_404(Application, student=pk, id=app_id)

    def get(self, request, pk, app_id, format=None):
        application = self.get_object(pk, app_id)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)

    def put(self, request, pk, app_id, format=None):
        application = self.get_object(pk, app_id)
        serializer = ApplicationSerializer(application, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, app_id, format=None):
        application = self.get_object(pk, app_id)
        application.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationCommentList(APIView):
    """
    List all comments for an application, or create a new comment for an application.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get(self, request, pk, format=None):
        comments = Comment.objects.filter(application=pk)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        application = get_object_or_404(Application, pk=pk)
        request.data['application'] = application.id
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(created_by=request.user.staff_profile, application=application)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ApplicationCommentDetail(APIView):
    """
    Retrieve, update or delete a comment for an application instance.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get_object(self, pk, comment_id):
        return get_object_or_404(Comment, application=pk, id=comment_id)

    def get(self, request, pk, comment_id, format=None):
        comment = self.get_object(pk, comment_id)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk, comment_id, format=None):
        comment = self.get_object(pk, comment_id)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, comment_id, format=None):
        comment = self.get_object(pk, comment_id)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ApplicationListPrefetch(APIView):
    """
    List all files which are necessary to prefetch for fully offline experience.
    """
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated, IsStaffMember,)

    def get(self, request, format=None):
        url = os.environ.get('API_URL')
        prefetch_all = request.query_params.get('all', 'false').lower() == 'true'
        if prefetch_all:
            applications = Application.objects.all()
            files = ApplicationFile.objects.all()
            files = [url + file.file.url for file in files]
            return Response(files)
        else:
            # fetch the files of the first page of applications
            applications = Application.objects.all()[:PAGE_SIZE]
            files = []
            for application in applications:
                for file in application.files.all():
                    files.append(url + file.file.url)
            return Response(files)
