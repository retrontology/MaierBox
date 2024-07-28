from django.contrib.sitemaps import Sitemap 
from .models import Post
from django.urls import reverse

class PostSitemap(Sitemap): 
	def items(self): 
		return Post.objects.all() 
		
	def lastmod(self, webimage: Post): 
		return webimage.date_modified
