from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from .models import Post

def view(request, id):
    post = get_object_or_404(Post, id=id)
    paragraphs = post.content.split('\n')
    context = {
        'name': post.name,
        'content': paragraphs,
        'images': post.webimages.all()
    }
    return render(request, 'posts/view.html', context)

@login_required
def add(request):
    return render(request, 'posts/add.html')

@login_required
def create(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])
    
    if not 'title' in request.FILES:
        JsonErrorResponse(
            data='The "title" field is required'
        )

    if not 'content' in request.FILES:
        JsonErrorResponse(
            data='The "content" field is required'
        )

    data = {}
    
    return JsonResponse(data)