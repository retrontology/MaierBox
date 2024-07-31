# Generated by Django 5.0.6 on 2024-07-30 11:13

import django.db.models.deletion
import images.models
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
        ('tags', '0001_initial'),
        ('watermarks', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='WebImage',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(editable=False, max_length=64)),
                ('original', models.ImageField(editable=False, upload_to=images.models.WebImage._upload_to_original)),
                ('full', models.ImageField(editable=False, upload_to=images.models.WebImage._upload_to_full)),
                ('scaled', models.ImageField(blank=True, editable=False, null=True, upload_to=images.models.WebImage._upload_to_scaled)),
                ('thumbnail', models.ImageField(editable=False, upload_to=images.models.WebImage._upload_to_thumbnail)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('unlisted', models.BooleanField(default=False)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='categories.category')),
                ('tags', models.ManyToManyField(blank=True, to='tags.tag')),
                ('watermark', models.ForeignKey(editable=False, null=True, on_delete=django.db.models.deletion.PROTECT, to='watermarks.watermark')),
            ],
        ),
    ]
