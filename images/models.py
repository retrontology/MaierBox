from django.db import models
from uuid import uuid4
from os.path import splitext

TAG_MAX_LENGTH = 24
CATEGORY_MAX_LENGTH = 24
IMAGE_MAX_LENGTH = 64
IMAGE_DIR = "images"

class Category(models.Model):
    name = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=CATEGORY_MAX_LENGTH,
    )

class Tag(models.Model):
    name = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=TAG_MAX_LENGTH,
    )

class Image(models.Model):

    def _upload_to(self, filename):
        ext = splitext(filename)[1]
        return f'{IMAGE_DIR}/{self.id}.{ext}'

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
        max_length=IMAGE_MAX_LENGTH
    )
    date_uploaded = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False
    )
    date_modified = models.DateTimeField(
        null=False,
        blank=False,
        auto_now=True,
    )
    image = models.ImageField(
        null=False,
        blank=False,
        upload_to=_upload_to,
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
