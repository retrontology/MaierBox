from django.urls import path
from . import views

app_name = "posts"
urlpatterns = [
    path("view/<str:id>", views.view, name="view"),
]
