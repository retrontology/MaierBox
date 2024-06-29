from django.urls import path
from . import views

app_name = "categories"
urlpatterns = [
    path("list", views.list_categories, name="list_categories"),
    path("add", views.add_category, name="add_categor"),
    path("images", views.image_index, name="image_index"),
    path("images/<str:category>", views.view_images, name="view_images"),
]
