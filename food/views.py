from food.models import Data
from food.serializer import DataSerializer
from django.shortcuts import render
from rest_framework import viewsets, renderers, filters

# Create your views here.

class DataViewSet(viewsets.ModelViewSet):
	filter_backends = (filters.DjangoFilterBackend,)
	filter_fields = ('id', 'name', 'x', 'y', 'content', 'tag')

	queryset = Data.objects.all()
	serializer_class = DataSerializer


