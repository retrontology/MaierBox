from django.urls import path
from . import views

app_name = "posts"
urlpatterns = [
    path("view/<str:id>", views.view, name="view"),
    path("add", views.add, name="add"),
    path("create", views.create, name="create"),
]
