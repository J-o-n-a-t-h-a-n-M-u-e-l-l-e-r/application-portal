from authentication.serializers import StaffSerializer, StudentSerializer
from rest_framework import serializers

from .models import Application, Comment, ApplicationFile


class CommentSerializer(serializers.ModelSerializer):
    created_by = StaffSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class ApplicationFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicationFile
        fields = '__all__'


class ApplicationSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    student = StudentSerializer(read_only=True)
    files = ApplicationFileSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = '__all__'


class PostApplicationSerializer(serializers.ModelSerializer):
    files = ApplicationFileSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = ['student', 'subject', 'description', 'created_at', 'updated_at', 'files']
