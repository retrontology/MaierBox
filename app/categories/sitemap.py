from django.contrib.sitemaps import Sitemap 
from .models import Category

class ImageCategorySitemap(Sitemap): 
	def items(self): 
		return Category.objects.all() 
