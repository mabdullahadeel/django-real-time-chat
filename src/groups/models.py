from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

# Group Query Manager Class


class GroupManager(models.Manager):
    def get_groups_of_user(self, username):
        query_set = Group.objects.filter(creator__username=username)
        return query_set


class Group(models.Model):
    group_name = models.CharField(max_length=30)
    uid = models.UUIDField(
        primary_key=False,
        unique=True,
        editable=False,
        default=uuid.uuid4
    )
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="creator", to_field="username")
    moderators = models.ManyToManyField(
        User, related_name="moderators", blank=True, null=True)
    members = models.ManyToManyField(
        User, related_name="members", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    last_editted = models.DateTimeField(auto_now=True)

    # chaeck if the user is the creator of the group
    def get_creator(self, pk, username):
        group = Group.objects.get(pk=pk)
        if group.creator.username == username:
            return True
        else:
            return False

    # get the name of the creator so that it can be sent to client via API
    def get_creator_name(self):
        return self.creator.username

    def __str__(self):
        return str(f'{self.creator.username} | {self.group_name}')

    objects = GroupManager()


class GroupMessage(models.Model):
    group_relation = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="group_relation", to_field="uid")
    author = models.ForeignKey(
        User, related_name="author", on_delete=models.CASCADE, to_field="username")
    content = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
