from django.db import models
from PIL import Image, ImageDraw, ImageFont
from django.contrib.auth.models import User
from .util import findFonts

WATERMARK_MARGIN=5
STROKE_PERCENT=5
WATERMARK_FIELDS=['text', 'size', 'font', 'transparency']

class Font(models.Model):
    name = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=64
    )
    family = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=64
    )
    style = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=64
    )
    path = models.CharField(
        null=False,
        blank=False,
        editable=False,
        max_length=256
    )

    @classmethod
    def populateFonts(cls):
        fonts = findFonts()
        fonts.sort(key=lambda x: f"{x['family']} {x['style']}")
        for font in fonts:
            if not cls.objects.filter(path=font['path']).exists():
                font_obj = cls(
                    name=font['name'],
                    family=font['family'],
                    style=font['style'],
                    path=font['path'],
                ).save()
                

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
    font = models.ForeignKey(
        to=Font,
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
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

        if image.mode != "RGBA":
            image = image.convert("RGBA")
        watermark = Image.new('RGBA', image.size, (255,255,255,0))
        draw = ImageDraw.Draw(watermark, 'RGBA')

        width, height = image.size
        if width > height:
            size = height
        else:
            size = width
        ratio = size / 200
        size = self.size * ratio
        
        font = ImageFont.truetype(self.font.path, int(size))
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
