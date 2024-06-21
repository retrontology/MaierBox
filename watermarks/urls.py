from django.urls import path
from . import views

app_name = "watermarks"
urlpatterns = [
    path("add", views.add, name="add"),
    path("create", views.create, name="create"),
]