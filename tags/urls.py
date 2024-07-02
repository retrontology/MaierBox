from django.urls import path
from . import views

app_name = "tags"
urlpatterns = [
    path("images/<str:tag>", views.view_images, name="view_images"),
]