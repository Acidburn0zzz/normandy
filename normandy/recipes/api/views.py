from rest_framework import permissions, viewsets

from normandy.recipes.models import Action
from normandy.recipes.api.serializers import ActionSerializer


class ActionViewSet(viewsets.ModelViewSet):
    """Viewset for viewing and uploading recipe actions."""
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    permission_classes = [permissions.DjangoModelPermissions]

    lookup_field = 'name'
    lookup_value_regex = r'[_\w]+'
