from django.urls import path
from . import views

app_name = "tags"
urlpatterns = [
    path("<str:tag>/images", views.view_images, name="view_images"),
]