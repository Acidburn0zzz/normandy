import pytest

from normandy.recipes.models import Action
from normandy.recipes.tests import ActionFactory


@pytest.mark.django_db
class TestActionAPI(object):
    def test_it_works(self, api_client):
        res = api_client.get('/api/v1/action/')
        assert res.status_code == 200
        assert res.data == []

    def test_it_serves_actions(self, api_client):
        ActionFactory(name='foo', implementation__data=b'foobar')

        res = api_client.get('/api/v1/action/')
        assert res.status_code == 200
        assert res.data == [
            {'name': 'foo', 'implementation': 'foobar'}
        ]

    def test_it_can_create_actions(self, api_client):
        res = api_client.post('/api/v1/action/', {'name': 'foo', 'implementation': 'foobar'})
        assert res.status_code == 201

        action = Action.objects.all()[0]
        assert action.name == 'foo'
        assert action.implementation_content == b'foobar'

    def test_it_can_edit_actions(self, api_client):
        ActionFactory(name='foo', implementation__data=b'original')

        res = api_client.patch('/api/v1/action/foo/', {'implementation': 'changed'})
        assert res.status_code == 200

        action = Action.objects.all()[0]
        assert action.name == 'foo'
        assert action.implementation_content == b'changed'

    def test_it_can_delete_actions(self, api_client):
        ActionFactory(name='foo', implementation__data=b'foobar')
        assert Action.objects.exists()

        res = api_client.delete('/api/v1/action/foo/')
        assert res.status_code == 204
        assert not Action.objects.exists()

    def test_name_validation(self, api_client):
        """Ensure the name field accepts _any_ valid slug."""
        # Slugs can contain alphanumerics plus _ and -.
        res = api_client.post('/api/v1/action/', {
            'name': 'foo-bar_baz2',
            'implementation': 'foobar',
        })
        assert res.status_code == 201

        action = Action.objects.all()[0]
        assert action.name == 'foo-bar_baz2'
        assert action.implementation_content == b'foobar'
