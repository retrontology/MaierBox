# Generated by Django 5.0.6 on 2024-07-14 06:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('watermarks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='font',
            name='style',
            field=models.CharField(editable=False, max_length=64),
        ),
    ]
