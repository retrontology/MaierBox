from django.urls import path
from django.contrib.sitemaps.views import sitemap
from . import views
from .sitemap import WebImageSitemap 

app_name = "images"
urlpatterns = [
    path("upload", views.upload, name="upload"),
    path("add", views.add, name="add"),
    path("delete/<str:id>", views.delete, name="delete"),
    path("update-category/<str:id>", views.update_category, name="update_category"),
    path("update-tags/<str:id>", views.update_tags, name="update_tags"),
    path("view/<str:id>", views.view, name="view"),
]