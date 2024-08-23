from django.db import models
from django.utils import timezone

from authentication.models import Student, Staff

APPLICATION_STATUS = (
    ('PENDING', 'Pending'),
    ('ACCEPTED', 'Accepted'),
    ('REJECTED', 'Rejected'),
    ('WAITLISTED', 'Waitlisted'),
)

SUBJECTS = (
    ('COMPUTER_SCIENCE', 'Computer Science'),
    ('MATH', 'Math'),
    ('PHYSICS', 'Physics'),
    ('CHEMISTRY', 'Chemistry'),
    ('BIOLOGY', 'Biology'),
    ('ECONOMICS', 'Economics'),
)


class Application(models.Model):
    student = models.ForeignKey(Student, related_name='applications', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, choices=APPLICATION_STATUS, default='PENDING')
    subject = models.CharField(max_length=50, choices=SUBJECTS, default='COMPUTER_SCIENCE')
    description = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return 'Application: ' + self.status + ' - ' + self.student.user_id.username

    class Meta:
        ordering = ['created_at']


class ApplicationFile(models.Model):
    application = models.ForeignKey(Application, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return 'File: ' + self.file.name

    class Meta:
        ordering = ['created_at']


class Comment(models.Model):
    application = models.ForeignKey(Application, related_name='comments', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(default=timezone.now)
    created_by = models.ForeignKey(Staff, related_name='comments', on_delete=models.CASCADE)

    def __str__(self):
        return 'Comment: ' + self.text

    class Meta:
        ordering = ['-created_at']
