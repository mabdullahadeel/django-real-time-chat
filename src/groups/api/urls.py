from django.urls import path
from . import views

from rest_framework import routers


urlpatterns = [
    path('', views.GroupList.as_view(), name="api-groups"),
    path('<int:pk>/', views.GroupDetail.as_view(), name="api-group-detail"),
]
