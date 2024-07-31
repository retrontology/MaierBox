from django.db import models
from django.core.files.uploadedfile import InMemoryUploadedFile
from categories.models import Category
from tags.models import Tag
from watermarks.models import Watermark
from io import BytesIO
from PIL import Image
from uuid import uuid4
from .util import gen_thumbnail, gen_scaled, SCALED_MAX
from os.path import splitext, basename
from django.urls import reverse


IMAGE_MAX_LENGTH = 64
ORIGINAL_IMAGE_DIR = "images/original"
FULL_IMAGE_DIR = "images/full"
SCALED_IMAGE_DIR = "images/scaled"
THUMBNAIL_IMAGE_DIR = "images/thumbnail"
ORIGINAL_SUBSAMPLING = 0
ORIGINAL_QUALITY = 95


class WebImage(models.Model):

    def _split_filename(self, filename):
        filename = basename(filename)
        return splitext(filename)
    
    def _upload_to_original(self, filename):
        ext = self._split_filename(filename)[1]
        return f'{ORIGINAL_IMAGE_DIR}/{self.id}{ext}'

    def _upload_to_full(self, filename):
        ext = self._split_filename(filename)[1]
        return f'{FULL_IMAGE_DIR}/{self.id}{ext}'
    
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
        upload_to=_upload_to_original,
    )
    full = models.ImageField(
        null=False,
        blank=False,
        editable=False,
        upload_to=_upload_to_full,
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
    watermark = models.ForeignKey(
        to=Watermark,
        blank=False,
        null=True,
        on_delete=models.PROTECT,
        editable=False,
    )
    unlisted = models.BooleanField(
        null=False,
        blank=False,
        default=False
    )
            

    @classmethod
    def from_image(cls, image, category=None, tags=None, watermark=None):
        id = uuid4()
        new_name = f'{id}.jpg'

        fields = {
            'name': image.name,
            'id': id,
            'category': category,
            'original': image,
        }

        image_bytes = BytesIO(image.read())
        image = Image.open(image_bytes)
        if image.mode != "RGB":
            image = image.convert("RGB")

        thumbnail = InMemoryUploadedFile(
            gen_thumbnail(image),
            'thumbnail',
            new_name,
            'JPEG',
            None,
            None
        )
        fields['thumbnail'] = thumbnail

        if watermark:
            image = watermark.draw(image)
        fields['watermark'] = watermark

        jpeg_data = BytesIO()
        image.save(
            jpeg_data,
            'jpeg',
            subsampling=ORIGINAL_SUBSAMPLING,
            quality=ORIGINAL_QUALITY
        )
        jpeg = InMemoryUploadedFile(
            jpeg_data,
            'resized',
            new_name,
            'JPEG',
            None,
            None
        )
        fields['full'] = jpeg

        if any(lambda x: x > SCALED_MAX for x in image.size):
            scaled = InMemoryUploadedFile(
                gen_scaled(image),
                'resized',
                new_name,
                'JPEG',
                None,
                None
            )
            fields['scaled'] = scaled
        else:
            fields['scaled'] = None

        image = WebImage(**fields)
        if tags:
            image.tags.set(tags)
        return image

    def get_scaled(self):
        return self.scaled.url if self.scaled else self.full.url

    def get_absolute_url(self):
        return reverse("images:view", args=[self.id])

    def __str__(self) -> str:
        return self.id
