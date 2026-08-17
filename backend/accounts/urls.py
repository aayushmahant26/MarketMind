from django.urls import path
from .views import register_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import register_user, protected_view

urlpatterns = [
    path('register/', register_user),
    path('login/', TokenObtainPairView.as_view()), # This will allow us to get the access token and the refresh token when we log in.
    path('refresh/', TokenRefreshView.as_view()), # This will allow us to get a new access token using the refresh token.
    path('protected/', protected_view),
]