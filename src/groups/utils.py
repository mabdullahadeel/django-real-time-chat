import json
from .models import GroupMessage


class HandleCustomGroupChatMethods:
    def messages_to_json(self, messages):
        resutl = []
        for message in messages:
            resutl.append(self.message_to_json(message))
        return resutl

    def message_to_json(self, message):
        return {
            'author': message.author.user.username,
            'content': message.content,
            'group_slug': message.group_relation.slug,
        }

    def user_groups_response(self, groups_of_user):
        response = {}
        for group in groups_of_user:
            group_messages = GroupMessage.objects.fetch_last_10_messages(
                group.slug)
            response[group.slug] = self.messages_to_json(group_messages)

        return response
