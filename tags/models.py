from django.db import models
from django.contrib.auth.models import User
from .util import TAG_MAX_LENGTH

class Tag(models.Model):

    tag = models.CharField(
        primary_key=True,
        null=False,
        blank=False,
        editable=False,
        unique=True,
        max_length=TAG_MAX_LENGTH,
    )
    date_created = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False,
    )
    creator = models.ForeignKey(
        to=User,
        blank=False,
        null=False,
        on_delete=models.PROTECT,
        editable=False,
    )

    def __str__(self) -> str:
        return self.tag
