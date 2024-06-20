from django.urls import path
from . import views

app_name = "categories"
urlpatterns = [
    path("", views.index, name="index"),
    path("add", views.add, name="add"),
    path("remove/<str:category>", views.remove, name="remove"),
]