from django.db import models
from images.models import WebImage
from tags.models import Tag
from categories.models import Category
from uuid import uuid4
from django.contrib.auth.models import User

ALBUM_MAX_LENGTH = 64

class WebImageAlbum(models.Model):
    id = models.UUIDField(
        primary_key=True,
        null=False,
        blank=False,
        default=uuid4,
        editable=False
    )
    name = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=ALBUM_MAX_LENGTH
    )
    images = models.ManyToManyField(
        blank=True,
        null=True,
        to=WebImage,
    )
    date_modified = models.DateTimeField(
        null=False,
        blank=False,
        auto_now=True,
        editable=False,
    )
    date_created = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False,
    )

    @classmethod
    def from_category(cls, category:Category):
        return WebImageAlbum(
            name=category.category,
            images=WebImage.objects.filter(category=category)
        )

    @classmethod
    def from_tags(cls, tags: list[Tag]):
        return WebImageAlbum(
            name=', '.join(tags),
            images=WebImage.objects.filter(tags=tags)
        )
