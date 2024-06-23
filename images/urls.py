from django.urls import path
from . import views

app_name = "images"
urlpatterns = [
    path("", views.view, name="index"),
    path("upload", views.upload, name="upload"),
    path("add", views.add, name="add"),
    path("view/<str:id>", views.view, name="view"),
]