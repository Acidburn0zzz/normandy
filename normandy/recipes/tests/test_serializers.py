import pytest

from normandy.recipes.tests import RecipeFactory, ActionFactory
from normandy.recipes.api.serializers import RecipeSerializer, ActionSerializer


@pytest.mark.django_db()
class TestRecipeSerializer:
    def test_it_works(self, rf):
        recipe = RecipeFactory(arguments={'foo': 'bar'})
        action = recipe.action
        serializer = RecipeSerializer(recipe, context={'request': rf.get('/')})

        assert serializer.data == {
            'name': recipe.name,
            'id': recipe.id,
            'enabled': recipe.enabled,
            'filter_expression': recipe.filter_expression,
            'revision_id': recipe.revision_id,
            'action_id': action.id,
            'arguments': {
                'foo': 'bar',
            }
        }


@pytest.mark.django_db()
class TestActionSerializer:
    def test_it_uses_cdn_url(self, rf, settings):
        settings.CDN_URL = 'https://example.com/cdn/'
        action = ActionFactory()
        serializer = ActionSerializer(action, context={'request': rf.get('/')})
        assert serializer.data['implementation_url'].startswith(settings.CDN_URL)
