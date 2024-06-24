from django.db import models
from django.contrib.auth.models import User
from .util import CATEGORY_MAX_LENGTH

class Category(models.Model):

    class Meta:
        verbose_name_plural = "categories"

    category = models.CharField(
        primary_key=True,
        null=False,
        blank=False,
        editable=False,
        unique=True,
        max_length=CATEGORY_MAX_LENGTH,
    )
    date_created = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False,
    )

    def __str__(self) -> str:
        return self.category
