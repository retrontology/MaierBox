from django.db import models
from PIL import Image, ImageDraw, ImageFont
from django.contrib.auth.models import User

WATERMARK_MARGIN=5
STROKE_PERCENT=5
WATERMARK_FIELDS=['text', 'size', 'font', 'transparency']

class Watermark(models.Model):

    text = models.CharField(
        null=False,
        blank=False,
        editable=True,
        max_length=16
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
    size = models.SmallIntegerField(
        blank=False,
        null=False,
        editable=True
    )
    font = models.CharField(
        null=False,
        blank=False,
        editable=True,
        max_length=64
    )
    transparency = models.SmallIntegerField (
        null=False,
        blank=False,
        editable=True,
    )
    created_by = models.ForeignKey(
        to=User,
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
    )

    def draw(self, image: Image):

        image = image.convert("RGBA")
        watermark = Image.new('RGBA', image.size, (255,255,255,0))
        draw = ImageDraw.Draw(watermark, 'RGBA')

        width, height = image.size
        if width > height:
            size = height
        else:
            size = width
        ratio = size / 100
        size = self.size * ratio / 3
        
        font = ImageFont.truetype(self.font, int(size))
        text = self.text

        margin = WATERMARK_MARGIN * ratio
        x = width - margin
        y = height - margin

        alpha = int((100 - self.transparency) * 255 / 100)

        stroke_width = int(size * STROKE_PERCENT / 100)

        draw.text(
            (x, y), text,
            fill=(255, 255, 255, alpha),
            font=font,
            stroke_width=stroke_width,
            stroke_fill=(0, 0, 0, alpha),
            language='en',
            anchor='rs'
        )
        image = Image.alpha_composite(image, watermark)
        image = image.convert("RGB")
        return image
