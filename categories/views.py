from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import render, get_object_or_404
from .models import Category

MAX_CATEGORIES = 100

def image_index(request):
    categories = []
    for category in Category.objects.all():
        if category.webimage_set.count() > 0:
            minidict = {
                'category': category,
                'thumbnail': category.webimage_set.first().thumbnail,
            }
            categories.append(minidict)
    context = {
        'categories': categories
    }
    return render(request, 'categories/images_index.html', context)

def view_images(request, category:str):
    category = get_object_or_404(Category, category=category)
    images = category.webimage_set.all()
    context = {
        'name': category.category,
        'images': images
    }
    return render(request, 'albums/view.html', context)
