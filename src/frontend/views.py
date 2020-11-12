from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'chat/index.html')


def room(request, room_name):
    context = {
        "room_name": room_name,
        'username': request.user.username
    }
    return render(request, 'frontend/index.html', context=context)
