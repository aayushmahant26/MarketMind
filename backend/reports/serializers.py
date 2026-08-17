from rest_framework import serializers
from .models import AIReport

class AIReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = AIReport
        fields = "__all__"