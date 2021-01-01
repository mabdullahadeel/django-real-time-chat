from django.shortcuts import render
from django.shortcuts import get_object_or_404
from profiles.models import Profile
from django.http import HttpResponse, JsonResponse
import json


def get_user_data_chat_frontend(request):
    #  getting the user from the profile to send the user data
    profile = get_object_or_404(Profile, user__username=request.user.username)
    context = {
        'username': request.user.username,
        'slug': profile.slug,
        'profile_picture': json.dumps(str(profile.profile_picture))
    }

    # return JsonResponse(context, safe=False)
    return render(request, 'frontend/index.html', context=context)
