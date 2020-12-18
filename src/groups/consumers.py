import json
from channels.generic.websocket import AsyncWebsocketConsumer

from django.contrib.auth import get_user_model

from .models import Group


class GroupChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = self.scope["url_route"]["kwargs"]["uid"]
        self.room_group_name = f"group_{self.group_name}"
        # creating and joining the room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
