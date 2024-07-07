from django.db import models
from categories.models import Category
from tags.models import Tag
from albums.models import WebImageAlbum
from uuid import uuid4

TITLE_MAX_LENGTH=64

class Post(models.Model):

    id = models.UUIDField(
        primary_key=True,
        null=False,
        blank=False,
        default=uuid4,
        editable=False
    )
    title = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=TITLE_MAX_LENGTH
    )
    content = models.TextField(
        null=False,
        blank=True,
        editable=True,
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
    album = models.ForeignKey(
        to=WebImageAlbum,
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
