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
        to=WebImage,
    )
    cover = models.ForeignKey(
        to=WebImage,
        blank=False,
        null=True,
        on_delete=models.SET_NULL,
        related_name="cover",
        related_query_name="cover"
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

