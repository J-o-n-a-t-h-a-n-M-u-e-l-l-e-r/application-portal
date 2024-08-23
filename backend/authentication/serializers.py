from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers

from .models import Student, Staff


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'


class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    """serializer for the users object"""
    student_profile = StudentSerializer(required=False)
    staff_profile = StaffSerializer(required=False)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'student_profile', 'staff_profile']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        student_data = validated_data.pop('student', None)
        staff_data = validated_data.pop('staff', None)

        # Create the user object
        user = User.objects.create_user(**validated_data)

        # Create student and staff objects if data is provided
        if student_data:
            Student.objects.create(user_id=user, **student_data)

        if staff_data:
            Staff.objects.create(user_id=user, **staff_data)

        return user

    def to_internal_value(self, data):
        student_data = data.get('student')
        staff_data = data.get('staff')

        # Validate the rest of the data
        validated_data = super().to_internal_value(data)

        # Add student and staff data back to validated_data if present
        if student_data is not None:
            validated_data['student'] = student_data
        if staff_data is not None:
            validated_data['staff'] = staff_data

        return validated_data


class AuthSerializer(serializers.Serializer):
    """serializer for the user authentication object"""
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password
        )

        if not user:
            msg = 'Unable to authenticate with provided credentials'
            raise serializers.ValidationError(msg, code='authentication')

        attrs['user'] = user
        return user
