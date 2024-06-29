from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from django.shortcuts import render, get_object_or_404
from .models import Category


def list_categories(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed('GET')
    response = {
        'categories': [x.category for x in Category.objects.all()]
    }
    return JsonResponse(response)

def add_category(request):
    if request.method != 'POST':
        return HttpResponseNotAllowed('POST')

    category_str = request.POST['category']

    try:
        category = Category(category_str)
        category.save()
    except Exception as e:
        response = {
            'error': f'Could not add the category "{category_str}" due to the following exception: {e}'
        }
        return JsonErrorResponse(response)
    
    response = {
        'category': category.category
    }
    return JsonResponse(response)

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
