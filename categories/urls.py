from django.urls import path
from . import views

app_name = "categories"
urlpatterns = [
    path("images", views.image_index, name="image_index"),
    path("images/<str:category>", views.view_images, name="view_images"),
]