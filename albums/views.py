from django.shortcuts import render, get_object_or_404
from .models import WebImageAlbum

def view(request, id):
    album = get_object_or_404(WebImageAlbum, id=id)
    context = {'album': album}
    return render(request, 'albums/view.html', context)
