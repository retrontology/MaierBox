from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseNotAllowed, HttpRequest, Http404
from django.core.paginator import Paginator
from maierbox.util import JsonErrorResponse
from .models import Post
from images.models import WebImage
from albums.models import WebImageAlbum
from markdown2 import markdown
import uuid

MAX_POSTS = 6

def index(request: HttpRequest):
    
    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    if 'page' in request.GET:
        page = request.GET['page']
    else:
        page = 1
    
    if 'max' in request.GET:
        max = request.GET['max']
    else:
        max = MAX_POSTS

    paginator = Paginator(
        Post.objects.filter(published=True, unlisted=False).order_by("-date_created"),
        per_page=max,
    )

    page = paginator.page(page)

    context = {'page': page}
    return render(request, 'posts/index.html', context)

def view(request: HttpRequest, id):
    post = get_object_or_404(Post, id=id)

    if not post.published and not request.user.is_authenticated:
        raise Http404
    
    content = markdown(post.content, extras=["tables", "break-on-newline"])
    context = {
        'id': post.id,
        'title': post.title,
        'date': post.date_created,
        'abs_url': post.get_absolute_url(),
        'content': content,
    }
    if (post.album and post.album.images.count() > 0):
        context['images'] = post.album.images.all().order_by('date_created')
        context['preview'] = request.build_absolute_uri(post.album.images.first().thumbnail.url)
    return render(request, 'posts/view.html', context)

@login_required
def add(request: HttpRequest):
    return render(request, 'posts/add.html')

@login_required
def create(request: HttpRequest):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])
    
    if not 'title' in request.POST:
        JsonErrorResponse(
            data='The "title" field is required'
        )
    title = request.POST['title']

    if not 'content' in request.POST:
        JsonErrorResponse(
            data='The "content" field is required'
        )
    content = request.POST['content']
    
    # Create album if images are specified
    album = None
    if 'images' in request.POST and len(request.POST['images']) > 0:
        webimages = []
        failed = []
        for image_id in request.POST['images'].split(','):
            try:
                webimage = WebImage.objects.get(id=image_id)
                webimages.append(webimage)
            except Exception as e:
                failed.append(image_id)
        if len(failed) > 0:
            print(f'FAILED: {",".join(failed)}')
            return JsonErrorResponse(
                data=f'The following WebImage IDs did not match any existing WebImages: {", ".join(failed)}'
            )
        album = WebImageAlbum(title=title)
        album.save()
        for webimage in webimages:
            album.images.add(webimage)
        album.save()
    post = Post(
        title=title,
        content=content,
        album=album,
    )
    post.save()
    data = {
        'post': post.id
    }
    return JsonResponse(data)

@login_required
def edit(request: HttpRequest, id):
    post = get_object_or_404(Post, id=id)
    context = {'post': post}
    return render(request, 'posts/edit.html', context)

@login_required
def update(request: HttpRequest, id):
    post = get_object_or_404(Post, id=id)

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])
    
    if not 'title' in request.POST:
        JsonErrorResponse(
            data='The "title" field is required'
        )
    title = request.POST['title']

    if not 'content' in request.POST:
        JsonErrorResponse(
            data='The "content" field is required'
        )
    content = request.POST['content']
    
    # Create album if images are specified
    if 'images' in request.POST and len(request.POST['images']) > 0:
        webimages = []
        failed = []
        for image_id in request.POST['images'].split(','):
            try:
                webimage = WebImage.objects.get(id=image_id)
                webimages.append(webimage)
            except Exception as e:
                failed.append(image_id)
        
        if len(failed) > 0:
            print(f'FAILED: {",".join(failed)}')
            return JsonErrorResponse(
                data=f'The following WebImage IDs did not match any existing WebImages: {", ".join(failed)}'
            )
        if post.album:
            post.album.images.clear()
            post.album.save()
        else:
            post.album = WebImageAlbum(title=title)
            post.album.save()
        for webimage in webimages:
            post.album.images.add(webimage)
        post.album.save()
    post.title = title
    post.content = content
    post.save()
    data = {
        'post': post.id
    }
    return JsonResponse(data)
