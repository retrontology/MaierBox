from io import BytesIO
from PIL import Image

SCALED_MAX = 2560
SCALED_QUALITY=90
SCALED_SUBSAMPLING=0
THUMBNAIL_MAX = 512
THUMBNAIL_QUALITY=80
THUMBNAIL_SUBSAMPLING=0


def gen_image(image, max, subsampling, quality):
    image = image.copy()
    image.thumbnail(
        (max,max),
        Image.LANCZOS
    )
    image_data = BytesIO()
    image.save(
        image_data,
        'jpeg',
        subsampling=subsampling,
        quality=quality
    )
    return image_data

def gen_thumbnail(image):
    return gen_image(image, max=THUMBNAIL_MAX, subsampling=THUMBNAIL_SUBSAMPLING, quality=THUMBNAIL_QUALITY)

def gen_scaled(image):
    return gen_image(image, max=SCALED_MAX, subsampling=SCALED_SUBSAMPLING, quality=SCALED_QUALITY)
