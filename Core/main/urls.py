from django.urls import path
from .views import SignInView



urlpatterns = [
    path('sign_in/', SignInView.as_view()),
]