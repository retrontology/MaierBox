from django.urls import path, re_path
from . import views

app_name = "posts"
urlpatterns = [
    re_path(r"^view/(?P<id>[^/]+)/?$", views.view, name="view"),
    path("add", views.add, name="add"),
    path("create", views.create, name="create"),
    path("edit/<str:id>", views.edit, name="edit"),
    path("update/<str:id>", views.update, name="update"),
    path("delete/<str:id>", views.delete, name="delete"),
    path("", views.index, name="index"),
]
