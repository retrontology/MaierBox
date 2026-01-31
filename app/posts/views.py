from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseNotAllowed, HttpRequest, Http404
from django.core.paginator import Paginator
from django.utils.dateparse import parse_date
from urllib.parse import urlencode
from maierbox.util import JsonErrorResponse
from .models import Post
from images.models import WebImage
from albums.models import WebImageAlbum
from markdown2 import markdown
import uuid

MAX_POSTS = 6
MAX_PER_PAGE = 100

def index(request: HttpRequest):
    
    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    page_number = request.GET.get('page', 1)
    try:
        page_number = int(page_number)
    except (TypeError, ValueError):
        page_number = 1

    per_page = request.GET.get('max', MAX_POSTS)
    try:
        per_page = int(per_page)
    except (TypeError, ValueError):
        per_page = MAX_POSTS
    if per_page < 1:
        per_page = MAX_POSTS
    if per_page > MAX_PER_PAGE:
        per_page = MAX_PER_PAGE

    date_from_raw = request.GET.get('start', '').strip()
    date_to_raw = request.GET.get('end', '').strip()
    date_from = parse_date(date_from_raw) if date_from_raw else None
    date_to = parse_date(date_to_raw) if date_to_raw else None
    if date_from and date_to and date_from > date_to:
        date_from, date_to = date_to, date_from
        date_from_raw, date_to_raw = date_to_raw, date_from_raw

    sort = request.GET.get('sort', 'newest')
    sort_options = {
        'newest': '-date_created',
        'oldest': 'date_created',
    }
    order_by = sort_options.get(sort, '-date_created')

    posts = Post.objects.filter(published=True, unlisted=False)
    if date_from:
        posts = posts.filter(date_created__date__gte=date_from)
    if date_to:
        posts = posts.filter(date_created__date__lte=date_to)

    paginator = Paginator(
        posts.order_by(order_by),
        per_page=per_page,
    )

    page = paginator.get_page(page_number)

    query_params = {
        'max': per_page,
        'sort': sort if sort in sort_options else 'newest',
    }
    if date_from and date_from_raw:
        query_params['start'] = date_from_raw
    if date_to and date_to_raw:
        query_params['end'] = date_to_raw
    query_string = urlencode(query_params)
    pagination_query = f"&{query_string}" if query_string else ""

    context = {
        'page': page,
        'pagination_query': pagination_query,
        'filters': {
            'start': date_from_raw if date_from else '',
            'end': date_to_raw if date_to else '',
            'sort': sort if sort in sort_options else 'newest',
            'max': per_page,
        },
        'per_page_options': [6, 12, 24, 48],
    }
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

@login_required
def delete(request: HttpRequest, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(['DELETE'])
    
    post = get_object_or_404(Post, id=id)
    post.delete()
    return redirect('/posts')
