from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    # write_only=True ensures the password can be sent to the backend, but is never sent back in any JSON responses.

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            # User.objects.create_user: This built-in Django helper hashes the password using the secure PBKDF2 algorithm with a SHA-256 hash by default.
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


