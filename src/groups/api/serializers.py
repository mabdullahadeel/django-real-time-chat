from ..models import Group, GroupMessage
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    # Changing the name of the field in the API result
    creator_username = serializers.CharField(source="get_creator_name")

    class Meta:
        model = Group
        fields = ['group_name', 'slug', 'creator_username']


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupMessage
        fields = '__all__'
