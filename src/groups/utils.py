import json


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
            'group_slug': message.group_relation.slug
        }
