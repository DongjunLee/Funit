# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-05-19 13:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('food', '0004_delete_category'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='Food',
            new_name='Data',
        ),
    ]
