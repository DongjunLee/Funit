from food.models import Data
from rest_framework import serializers

class DataSerializer(serializers.HyperlinkedModelSerializer):
	
	class Meta:
		model = Data
		fields = ('id', 'name', 'x', 'y', 'content', 'tag')
 
