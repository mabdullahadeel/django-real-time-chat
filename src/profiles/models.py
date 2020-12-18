from django.db import models
from django.conf import settings
from django.template.defaultfilters import slugify
from .utils import get_random_number


class ProfileManager(models.Manager):
    pass


class Profile(models.Model):
    first_name = models.CharField(max_length=200, blank=True)
    last_name = models.CharField(max_length=200, blank=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE, related_name="user")
    email = models.EmailField(max_length=200, blank=True)
    country = models.CharField(max_length=100, blank=True)

    # Connections
    friends = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name='friends')
    slug = models.SlugField(unique=True, blank=True)
    update = models.DateField(auto_now=True, blank=True)
    created = models.DateTimeField(auto_now_add=True, blank=True)

    # Profile Picture
    profile_picture = models.ImageField(
        default='default_avatar.png', upload_to='profile_pictures/')

    # Extending the quryset Potential
    objects = ProfileManager()

    # peventing the over-riding of slug field at the profile edits
    __initial__first_name = None
    __initial__last_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.__initial__first_name = self.first_name
        self.__initial__last_name = self.last_name

    def save(self, *args, **kwargs):
        is_exist = False
        if self.first_name != self.__initial__first_name or self.last_name != self.__initial__last_name:
            if self.first_name and self.last_name:
                to_slug = slugify(str(self.first_name + " " + self.last_name))
                is_exist = Profile.objects.filter(slug=to_slug).exists()
                while is_exist:
                    # append a random number until unique slug
                    to_slug = slugify(to_slug + " " + str(get_random_number()))
                    is_exist = Profile.objects.filter(slug=to_slug).exists()
        else:
            to_slug = str(self.user)

        self.slug = to_slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} | {self.first_name} - {self.last_name} | {self.created.strftime('%d-%m-%Y')}"


STATUS_CHOICES = (
    ('send', 'send'),
    ('accepted', 'accepted')
)


class RelationshipManager(models.Manager):
    def invitation_received(self, receiver):
        query_set = Relationship.objects.filter(
            receiver=receiver, status="send")


class Relationship(models.Model):
    sender = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey(
        Profile, on_delete=models.CASCADE, related_name='receiver')
    status = models.CharField(max_length=8, choices=STATUS_CHOICES)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    # Extending the queryset
    objects = RelationshipManager()

    def __str__(self):
        return f"{self.sender} - {self.receiver} | {self.status}"
