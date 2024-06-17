from django.db import models
from django.contrib.auth.models import User
from uuid import uuid4
from os.path import splitext, basename

TAG_MAX_LENGTH = 24
CATEGORY_MAX_LENGTH = 24
IMAGE_MAX_LENGTH = 64
BASE_IMAGE_DIR = "images"
SCALED_IMAGE_DIR = "images/scaled"
THUMBNAIL_IMAGE_DIR = "images/thumbnail"
SCALED_MAX = 2560
THUMBNAIL_MAX = 512
SCALED_QUALITY=90
SCALED_SUBSAMPLING=0
THUMBNAIL_QUALITY=80
THUMBNAIL_SUBSAMPLING=0
ORIGINAL_QUALITY=95
ORIGINAL_SUBSAMPLING=0


class Category(models.Model):

    class Meta:
        verbose_name_plural = "categories"

    name = models.CharField(
        null=False,
        blank=False,
        editable=True,
        unique=True,
        max_length=CATEGORY_MAX_LENGTH,
    )

    def __str__(self) -> str:
        return self.name

class Tag(models.Model):
    name = models.CharField(
        null=False,
        blank=False,
        editable=True,
        unique=True,
        max_length=TAG_MAX_LENGTH,
    )

    def __str__(self) -> str:
        return self.name

class WebImage(models.Model):

    def _split_filename(self, filename):
        filename = basename(filename)
        return splitext(filename)

    def _upload_to_base(self, filename):
        ext = self._split_filename(filename)[1]
        return f'{BASE_IMAGE_DIR}/{self.id}{ext}'
    
    def _upload_to_scaled(self, filename):
        ext = self._split_filename(filename)[1]
        return f'{SCALED_IMAGE_DIR}/{self.id}{ext}'
    
    def _upload_to_thumbnail(self, filename):
        ext = self._split_filename(filename)[1]
        return f'{THUMBNAIL_IMAGE_DIR}/{self.id}{ext}'

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
        max_length=IMAGE_MAX_LENGTH
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
    original = models.ImageField(
        null=False,
        blank=False,
        editable=False,
        upload_to=_upload_to_base,
    )
    scaled = models.ImageField(
        null=True,
        blank=True,
        editable=False,
        upload_to=_upload_to_scaled,
    )
    thumbnail = models.ImageField(
        null=False,
        blank=False,
        editable=False,
        upload_to=_upload_to_thumbnail,
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
    )

    def get_scaled(self):
        return self.scaled if self.scaled else self.original

    def __str__(self) -> str:
        return basename(self.original.path)
