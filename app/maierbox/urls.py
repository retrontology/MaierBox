from django.contrib import admin, auth
from django.urls import include, path
from django.views.static import serve
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.contrib.sitemaps.views import sitemap
from images.sitemap import WebImageSitemap
from posts.sitemap import PostSitemap
from albums.sitemap import WebImageAlbumSitemap
from categories.sitemap import ImageCategorySitemap
from .sitemap import StaticSitemap

sitemaps = {
    'sitemaps': {
        'static': StaticSitemap,
        'post': PostSitemap,
        'album': WebImageAlbumSitemap,
        'image': WebImageSitemap,
        'category': ImageCategorySitemap,
    }
}

urlpatterns = [
    path("", views.index, name="index"),
    path("images/", include("images.urls")),
    path("tags/", include("tags.urls")),
    path("categories/", include("categories.urls")),
    path("watermarks/", include("watermarks.urls")),
    path("albums/", include("albums.urls")),
    path("posts/", include("posts.urls")),
    path('admin/', admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path('sitemap.xml', sitemap, sitemaps, name='django.contrib.sitemaps.views.sitemap'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)