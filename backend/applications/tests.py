from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Application, ApplicationFile, Comment, Student, Staff


class ApplicationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_staff = User.objects.create_user(username='testuserstaff', password='testpass')
        self.user_student = User.objects.create_user(username='testuserstudent', password='testpass')
        self.admin = User.objects.create_superuser(username='testadmin', password='testpass')
        self.staff = Staff.objects.create(user_id=self.user_staff, position='Test Position', department='Test Department', birth_date='1990-01-01')
        self.student = Student.objects.create(user_id=self.user_student, phone='1234567890', address='Test Address', current_degree='Test Degree', birth_date='2000-01-01')
        self.application = Application.objects.create(
            student=self.student,
            status='PENDING',
            subject='COMPUTER_SCIENCE',
            description='Application Description'
        )
        self.application_file = ApplicationFile.objects.create(
            application=self.application,
            file='testfile.txt'
        )
        self.comment = Comment.objects.create(
            application=self.application,
            text='Test comment',
            created_by=self.staff
        )

    # Check that the models are created correctly
    def test_application_creation(self):
        self.assertEqual(self.application.__str__(), 'Application: PENDING - testuserstudent')

    def test_application_file_creation(self):
        self.assertEqual(self.application_file.__str__(), 'File: testfile.txt')

    def test_comment_creation(self):
        self.assertEqual(self.comment.__str__(), 'Comment: Test comment')

    # Check that each view is only accessible by staff members except for the student_applications view
    def test_get_applications(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('index'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_application_detail(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('detail', args=[self.application.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('detail', args=[self.application.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_students(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('student'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('student'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_student_detail(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('student_detail', args=[self.student.user_id.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('student_detail', args=[self.student.user_id.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_student_applications(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('student_applications', args=[self.student.user_id.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('student_applications', args=[self.student.user_id.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_application_comments(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('comments', args=[self.application.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('comments', args=[self.application.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_application_comment_detail(self):
        self.client.force_authenticate(user=self.user_staff)
        response = self.client.get(reverse('comment_detail', args=[self.application.id, self.comment.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.client.force_authenticate(user=self.user_student)
        response = self.client.get(reverse('comment_detail', args=[self.application.id, self.comment.id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
