from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from .models import Post

def view(request, id):
    post = get_object_or_404(Post, id=id)
    context = {
        'name': post.name,
        'content': post.content,
        'images': post.album.images.all()
    }
    return render(request, 'posts/view.html', context)
