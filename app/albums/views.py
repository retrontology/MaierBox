from django.shortcuts import render, get_object_or_404
from django.http import HttpRequest
from .models import WebImageAlbum

def view(request: HttpRequest, id):
    album = get_object_or_404(WebImageAlbum, id=id)
    context = {
        'title': album.title,
        'images': album.images.all().order_by('date_created')
    }
    if (album.images.count() > 0):
        context['preview'] = request.build_absolute_uri(album.images.first().thumbnail.url)
    return render(request, 'albums/view.html', context)
