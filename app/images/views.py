from django.shortcuts import render, get_object_or_404, redirect
from maierbox.util import JsonErrorResponse
from django.http import JsonResponse, HttpResponseNotAllowed, HttpRequest
from django.contrib.auth.decorators import login_required
from watermarks.models import Watermark
from .models import *
from categories.models import Category
from tags.models import Tag

def view(request: HttpRequest, id):
    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    referer = request.META.get('HTTP_REFERER')
    image = get_object_or_404(WebImage, id=id)
    context = {
        'image': image,
        'referer': referer,
        'preview': request.build_absolute_uri(image.thumbnail.url)
    }
    return render(request, 'images/view.html', context)

@login_required
def upload(request: HttpRequest):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    if not 'image' in request.FILES:
        JsonErrorResponse(
            data='The "image" field/file is required'
        )

    fields = {
        'image': request.FILES['image'],
    }

    if 'category' in request.POST:
        fields['category'] = Category.objects.get(category=request.POST['category'])
    else:
        fields['category'] = None
    
    if 'watermark' in request.POST:
        fields['watermark'] = Watermark.objects.get(id=request.POST['watermark'])
    else:
        fields['watermark'] = None

    image = WebImage.from_image(**fields)
    image.save()

    if 'tags' in request.POST:
        for tag in request.POST['tags'].split(','):
            tag, created = Tag.objects.get_or_create(tag=tag)
            if created:
                tag.save()
            image.tags.add(tag)

    image.save()
    
    return JsonResponse(
        status=200,
        data={
            'response': image.id
        }
    )

@login_required
def add(request: HttpRequest):
    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    return render(request, 'images/add.html')

@login_required
def delete(request: HttpRequest, id):
    if request.method != "DELETE":
        return HttpResponseNotAllowed(['DELETE'])
    
    image = get_object_or_404(WebImage, id=id)
    image.delete()
    return redirect('/')

@login_required
def update_category(request: HttpRequest, id):
    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    image = get_object_or_404(WebImage, id=id)
    category = request.POST.get('category', '').strip()
    if category == '':
        image.category = None
    else:
        try:
            image.category = Category.objects.get(category=category)
        except Category.DoesNotExist:
            return JsonErrorResponse(f'Category "{category}" does not exist')

    image.save()
    return JsonResponse(
        status=200,
        data={
            'category': category
        }
    )

@login_required
def update_tags(request: HttpRequest, id):
    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    image = get_object_or_404(WebImage, id=id)
    tags_str = request.POST.get('tags', '').strip()
    image.tags.clear()

    tags = []
    if tags_str != '':
        for tag in tags_str.split(','):
            cleaned_tag = tag.strip().lower()
            if cleaned_tag == '' or cleaned_tag in tags:
                continue
            tag_obj, created = Tag.objects.get_or_create(tag=cleaned_tag)
            if created:
                tag_obj.save()
            image.tags.add(tag_obj)
            tags.append(cleaned_tag)

    image.save()
    return JsonResponse(
        status=200,
        data={
            'tags': tags
        }
    )
