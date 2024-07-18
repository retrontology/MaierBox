from django.urls import path
from . import views

app_name = "categories"
urlpatterns = [
    path("list", views.list, name="list"),
    path("add", views.add_category, name="add_category"),
    path("images", views.image_index, name="image_index"),
    path("images/<str:category>", views.view_images, name="view_images"),
]
