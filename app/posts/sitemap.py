from django.contrib.sitemaps import Sitemap 
from .models import Post
from django.urls import reverse

class PostStaticSitemap(Sitemap):
    def items(self):
        return ['index']

    def location(self, item):
        return reverse(f'posts:{item}')

class PostSitemap(Sitemap): 
	def items(self): 
		return Post.objects.all() 
		
	def lastmod(self, webimage: Post): 
		return webimage.date_modified
