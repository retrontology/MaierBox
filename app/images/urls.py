from django.urls import path
from django.contrib.sitemaps.views import sitemap
from . import views
from .sitemap import WebImageSitemap 

app_name = "images"
urlpatterns = [
    path("upload", views.upload, name="upload"),
    path("add", views.add, name="add"),
    path("delete/<str:id>", views.delete, name="delete"),
    path("view/<str:id>", views.view, name="view"),
]