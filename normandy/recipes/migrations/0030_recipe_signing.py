# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-06-09 17:48
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('recipes', '0029_recipe_last_updated'),
    ]

    operations = [
        migrations.CreateModel(
            name='Signature',
            fields=[
                ('id', models.AutoField(
                    auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('signature', models.TextField()),
                ('timestamp', models.DateTimeField(default=django.utils.timezone.now)),
                ('x5u', models.TextField(null=True)),
                ('public_key', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='recipe',
            name='signature',
            field=models.OneToOneField(
                blank=True, null=True, on_delete=django.db.models.deletion.CASCADE,
                related_name='recipe', to='recipes.Signature'),
        ),
    ]