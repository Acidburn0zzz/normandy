from rest_framework import serializers
from reversion.models import Version

from normandy.recipes.api.fields import ActionImplementationHyperlinkField
from normandy.recipes.models import Action, Recipe


class ActionSerializer(serializers.ModelSerializer):
    arguments_schema = serializers.JSONField()
    implementation = serializers.CharField(write_only=True)
    implementation_url = ActionImplementationHyperlinkField()

    class Meta:
        model = Action
        fields = [
            'name',
            'implementation',
            'implementation_url',
            'arguments_schema',
        ]


class RecipeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField()
    revision_id = serializers.IntegerField(read_only=True)
    action = ActionSerializer()
    arguments = serializers.JSONField()

    class Meta:
        model = Recipe
        fields = [
            'id',
            'name',
            'enabled',
            'revision_id',
            'action',
            'arguments',
            'filter_expression',
        ]


class ClientSerializer(serializers.Serializer):
    country = serializers.CharField()
    request_time = serializers.DateTimeField()


class RecipeVersionSerializer(serializers.ModelSerializer):
    date_created = serializers.DateTimeField(source='revision.date_created', read_only=True)
    recipe = RecipeSerializer(source='object_version.object', read_only=True)

    class Meta:
        model = Version
        fields = [
            'date_created',
            'recipe',
        ]
