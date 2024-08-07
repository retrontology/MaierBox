# Generated by Django 5.0.6 on 2024-07-28 15:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('albums', '0008_webimagealbum_unlisted'),
        ('posts', '0005_alter_post_published'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='album',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='albums.webimagealbum'),
        ),
    ]
