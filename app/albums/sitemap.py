from django.contrib.sitemaps import Sitemap 
from .models import WebImageAlbum

class WebImageAlbumSitemap(Sitemap): 
	def items(self): 
		return WebImageAlbum.objects.filter(unlisted=False) 
		
	def lastmod(self, webimage: WebImageAlbum): 
		return webimage.date_modified
