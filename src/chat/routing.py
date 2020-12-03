from django.urls import re_path, path

from . import consumers
from groups.consumers import GroupChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
    path('group-chat/<uid>/', GroupChatConsumer.as_asgi()),
]
