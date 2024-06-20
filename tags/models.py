from django.db import models

TAG_MAX_LENGTH = 24

class Tag(models.Model):
    name = models.CharField(
        primary_key=True,
        null=False,
        blank=False,
        editable=True,
        unique=True,
        max_length=TAG_MAX_LENGTH,
    )

    def __str__(self) -> str:
        return self.name
