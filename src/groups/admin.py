from django.contrib import admin
from profiles.models import Profile
from .models import Group, GroupMessage, GroupMembership
import uuid


class MessageAdmin(admin.TabularInline):
    model = GroupMessage
    extra = 1


class MembersAdmin(admin.TabularInline):
    model = GroupMembership
    extra = 1


class GroupAdmin(admin.ModelAdmin):
    inlines = [
        MembersAdmin,
        MessageAdmin,
    ]
    # readonly_fields = ['creator', 'slug']
    # empty_value_display = '-None-'

    # def save_model(self, request, obj, form, change):
    #     creator_profile = Profile.objects.get(user=request.user)
    #     obj.creator = creator_profile
    #     super().save_model(request, obj, form, change)


admin.site.register(Group, GroupAdmin)
