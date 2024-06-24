from django.urls import path
from . import views

app_name = "categories"
urlpatterns = [
    path("<str:category>/images", views.view_images, name="view_images"),
]