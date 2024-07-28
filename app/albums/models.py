from django.db import models
from images.models import WebImage
from uuid import uuid4
from django.urls import reverse

MAX_TITLE_LENGTH = 64
MAX_PREVIEW_IMAGES = 4

class WebImageAlbum(models.Model):
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
        max_length=MAX_TITLE_LENGTH
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
    unlisted = models.BooleanField(
        null=False,
        blank=False,
        default=False
    )

    def hasImages(self):
        return self.images.count() > 0
    
    def preview(self):
        length = self.images.count()
        if length > MAX_PREVIEW_IMAGES:
            length = MAX_PREVIEW_IMAGES
        return self.images.order_by('date_created')[:length]

    def get_absolute_url(self):
        return reverse("albums:view", args=[self.id])
