from django.db import models
from categories.models import Category
from tags.models import Tag
from albums.models import WebImageAlbum
from uuid import uuid4
from django.urls import reverse

TITLE_MAX_LENGTH=64
PREVIEW_LENGTH=256

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
        blank=True,
        null=True,
        on_delete=models.SET_NULL,
    )
    album = models.ForeignKey(
        to=WebImageAlbum,
        blank=True,
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
    date_published = models.DateTimeField(
        null=True,
        blank=False,
        editable=False,
    )
    published = models.BooleanField(
        null=False,
        blank=False,
        default=True
    )
    unlisted = models.BooleanField(
        null=False,
        blank=False,
        default=False
    )

    def preview(self):
        length = len(self.content)
        cutoff = False
        if length > PREVIEW_LENGTH:
            length = PREVIEW_LENGTH
            cutoff = True
        preview = self.content[:length]
        if cutoff:
            preview = preview + '...'
        return preview

    def hasImages(self):
        return self.album and self.album.hasImages()
    
    def get_absolute_url(self):
        return reverse("posts:view", args=[self.id])
