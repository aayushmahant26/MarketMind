from django.db import models
from django.contrib.auth.models import User

class AIReport(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    query = models.TextField()
    symbol = models.CharField(max_length=50)
    report = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.symbol}"
    
class ChatMessage(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    symbol = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    linked_report = models.ForeignKey(
        AIReport,
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )

    message = models.TextField()
    response = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username