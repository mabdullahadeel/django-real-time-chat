from django.urls import path
from . import views


app_name = 'chat'

urlpatterns = [
    path('', views.get_user_data_chat_frontend,
         name='get_user_data_chat_frontend'),
]
