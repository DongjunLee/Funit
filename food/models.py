#-*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.utils.encoding import python_2_unicode_compatible
from django.db import models

@python_2_unicode_compatible
class Data(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=30)
	x = models.FloatField()
	y = models.FloatField()
	content = models.TextField(max_length=100)
	tag = models.TextField(max_length=150, default="")

	def __str__(self):
		return '%s' % (self.name)
	
