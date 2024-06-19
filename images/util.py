from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from .models import THUMBNAIL_MAX, THUMBNAIL_SUBSAMPLING, THUMBNAIL_QUALITY
from io import BytesIO

def gen_thumbnail(image, max=THUMBNAIL_MAX):
    thumbnail = image.copy()
    thumbnail.thumbnail(
        (THUMBNAIL_MAX,THUMBNAIL_MAX),
        Image.LANCZOS
    )
    thumbnail_data = BytesIO()
    thumbnail.save(
        thumbnail_data,
        'jpeg',
        subsampling=THUMBNAIL_SUBSAMPLING,
        quality=THUMBNAIL_QUALITY
    )
    return thumbnail_data

def gen_scaled(image, max=THUMBNAIL_MAX):
    pass