from django.db import models
from django.urls import reverse
from .util import CATEGORY_MAX_LENGTH

class Category(models.Model):

    class Meta:
        verbose_name_plural = "categories"

    category = models.CharField(
        primary_key=True,
        null=False,
        blank=False,
        editable=False,
        unique=True,
        max_length=CATEGORY_MAX_LENGTH,
    )
    date_created = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False,
    )

    def thumbnail(self):
        return self.webimage_set.first().thumbnail
    
    def get_absolute_url(self):
        return reverse("categories:view_images", args=[self.category])

    def __str__(self) -> str:
        return self.category
