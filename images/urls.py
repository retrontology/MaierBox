from django.urls import path
from . import views

app_name = "images"
urlpatterns = [
    path("", views.view, name="index"),
    path("upload", views.upload, name="upload"),
    path("add", views.add, name="add"),
    path("add_tag", views.add_tag, name="add_tag"),
    path("add_category", views.add_category, name="add_category"),
]