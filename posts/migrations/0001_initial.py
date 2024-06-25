# Generated by Django 5.0.6 on 2024-06-25 06:01

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('albums', '0006_remove_tagalbum_webimagealbum_ptr_and_more'),
        ('categories', '0002_remove_category_created_by'),
        ('tags', '0002_remove_tag_created_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(editable=False, max_length=64)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('album', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='albums.webimagealbum')),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='categories.category')),
                ('tags', models.ManyToManyField(blank=True, to='tags.tag')),
            ],
        ),
    ]
