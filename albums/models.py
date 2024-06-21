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
    tags = models.ManyToManyField(
        blank=True,
        to=Tag,
    )
    category = models.ForeignKey(
        to=Category,
        blank=False,
        null=True,
        on_delete=models.SET_NULL,
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
    uploader = models.ForeignKey(
        to=User,
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
        related_name="user_uploaded",
        related_query_name="user_uploaded",
    )
    modified_by = models.ForeignKey(
        to=User,
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
        related_name="user_modified",
        related_query_name="user_modified",
    )