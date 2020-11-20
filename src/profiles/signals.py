from django.db.models.signals import post_save
from django.conf import settings
from django.dispatch import receiver

from .models import Profile

# Creating the Profile when default userCreationModel instance is created


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def post_save_create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
