from django.contrib import admin

from .models import Group, GroupMessage


class MessageAdmin(admin.TabularInline):
    model = GroupMessage
    extra = 1


class GroupAdmin(admin.ModelAdmin):
    inlines = [
        MessageAdmin,
    ]
    readonly_fields = ['creator']
    empty_value_display = '-None-'

    def save_model(self, request, obj, form, change):
        obj.creator = request.user
        super().save_model(request, obj, form, change)


admin.site.register(Group, GroupAdmin)
