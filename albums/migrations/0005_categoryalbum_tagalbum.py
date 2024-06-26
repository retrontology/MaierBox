# Generated by Django 5.0.6 on 2024-06-24 16:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('albums', '0004_alter_webimagealbum_images'),
    ]

    operations = [
        migrations.CreateModel(
            name='CategoryAlbum',
            fields=[
                ('webimagealbum_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='albums.webimagealbum')),
            ],
            options={
                'managed': False,
            },
            bases=('albums.webimagealbum',),
        ),
        migrations.CreateModel(
            name='TagAlbum',
            fields=[
                ('webimagealbum_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='albums.webimagealbum')),
            ],
            options={
                'managed': False,
            },
            bases=('albums.webimagealbum',),
        ),
    ]
