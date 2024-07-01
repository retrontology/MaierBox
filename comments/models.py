from django.db import models
from posts.models import Post
from images.models import WebImage
from uuid import uuid4

NAME_MAX_LENGTH = 64

class Comment(models.Model):

    class Meta:
        abstract = True

    id = models.UUIDField(
        primary_key=True,
        null=False,
        blank=False,
        default=uuid4,
        editable=False
    )
    date_created = models.DateTimeField(
        null=False,
        blank=False,
        auto_now_add=True,
        editable=False,
    )
    name = models.CharField(
        null=False,
        blank=True,
        editable=False,
        max_length=NAME_MAX_LENGTH,
    )
    ip = models.GenericIPAddressField(
        null=False,
        blank=False,
        editable=False,
    )
    content = content = models.TextField(
        null=False,
        blank=False,
        editable=False,
    )
    email = models.EmailField(
        null=True,
        blank=False,
    )
    parent = models.ForeignKey(
        to='self',
        on_delete=models.CASCADE,
        null=True,
        blank=False,
    )
    
class ImageComment(models.Model):
    image = models.ForeignKey(
        to=WebImage,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )

class PostComment(models.Model):
    post = models.ForeignKey(
        to=Post,
        on_delete=models.CASCADE,
        null=False,
        blank=False,
    )