from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
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