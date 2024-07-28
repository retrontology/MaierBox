from django.urls import path
from . import views

app_name = "posts"
urlpatterns = [
    path("view/<str:id>", views.view, name="view"),
    path("add", views.add, name="add"),
    path("create", views.create, name="create"),
    path("edit/<str:id>", views.edit, name="edit"),
    path("update/<str:id>", views.update, name="update"),
    path("", views.index, name="index"),
]
