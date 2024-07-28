from django.contrib.sitemaps import Sitemap 
from .models import WebImage 

class WebImageSitemap(Sitemap): 
	def items(self): 
		return WebImage.objects.all() 
		
	def lastmod(self, webimage: WebImage): 
		return webimage.date_modified
