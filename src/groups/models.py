from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
from django.template.defaultfilters import slugify
from profiles.utils import get_random_number
from profiles.models import Profile

User = get_user_model()


# Group Query Manager Class

class GroupManager(models.Manager):
    def get_groups_of_user(self, user):
        profile = Profile.objects.get(user=user)
        query_set = Group.objects.filter(
            Q(creator__slug=user)
            | Q(members__user=user)
        )
        return query_set


class Group(models.Model):
    group_name = models.CharField(max_length=30)
    slug = models.SlugField(unique=True, blank=True)
    creator = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name="creator")
    members = models.ManyToManyField(
        Profile, related_name="members", blank=True, through="GroupMembership",
        through_fields=("group", "profile"))
    created_at = models.DateTimeField(auto_now_add=True)
    last_editted = models.DateTimeField(auto_now=True)

    # chaeck if the user is the creator of the group
    def is_creator(self, pk, username):
        group = Group.objects.get(pk=pk)
        if group.creator.username == username:
            return True
        else:
            return False

    # get the name of the creator so that it can be sent to client via API
    def get_creator_name(self):
        return self.creator.username

    # peventing the over-riding of slug field at the profile edits
    __initial_group_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__initial_group_name = self.group_name

    def save(self, *args, **kwargs):
        is_exist = False
        if self.group_name != self.__initial_group_name:
            if self.group_name:
                to_slug = slugify(str(self.group_name))
                is_exist = Group.objects.filter(slug=to_slug).exists()
                while is_exist:
                    # append a random number until unique slug
                    to_slug = slugify(to_slug + " " + str(get_random_number()))
                    is_exist = Group.objects.filter(slug=to_slug).exists()
        else:
            to_slug = slugify(str(self.group_name))

        self.slug = to_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return str(f'{self.creator.user.username} | {self.group_name}')

    objects = GroupManager()


class GroupMembership(models.Model):
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    class Meta:
        unique_together = [['group', 'profile']]


class GroupMessage(models.Model):
    group_relation = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="group_relation", to_field="slug")
    author = models.ForeignKey(
        Profile, related_name="author", on_delete=models.CASCADE)
    content = models.TextField(max_length=1000)
    created = models.DateTimeField(auto_now_add=True)
