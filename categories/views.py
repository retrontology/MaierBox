from django.http import JsonResponse, HttpResponseNotAllowed
from django.shortcuts import render, get_object_or_404
from .models import Category
from maierbox.util import JsonErrorResponse
from django.core.paginator import Paginator
from .util import validateCategory
from images.models import WebImage

MAX_CATEGORIES = 100

def add(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    if 'category' not in request.POST:
        return JsonErrorResponse(
            'The category field must be included in the request'
        )
    
    category = request.POST['category'].lower()

    if not validateCategory(category):
        return JsonErrorResponse(
            f'The category {category} failed validation'
        )

    category = Category.objects.filter(category=category).first()
    if category:
        return JsonErrorResponse(
            f'The category "{category}" already exists'
        )
    
    category = Category(
        created_by=request.user,
        category=category
    ).save()

    return JsonResponse(
        status=200,
        data={
            'response': f'The category "{category}" has been added successfully'
        }
    )


def remove(request, category):

    if request.method != "DELETE":
        return HttpResponseNotAllowed(['DELETE'])
    
    category = category.lower()

    if not validateCategory(category):
        return JsonErrorResponse(
            f'The category {category} failed validation'
        )

    category_obj = Category.objects.filter(category=category).first()
    if not category_obj:
        return JsonErrorResponse(
            f'The category "{category}" does not exist'
        )

    category_obj.delete()

    return JsonResponse(
        status=200,
        data={
            'response': f'The category "{category}" has been removed successfully'
        }
    )


def index(request):

    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    page = request.GET.get("page")
    if not page:
        page = 1
    
    paginator = Paginator(
        Category.objects.order_by("category"),
        per_page=MAX_CATEGORIES,
    )

    page = paginator.page(page)

    data = {
        'categories': page.object_list
    }

    if page.has_next():
        data['next'] = page.next_page_number()

    return JsonResponse(
        status=200,
        data=data
    )

def view_images(request, category:str):
    category = get_object_or_404(Category, category=category)
    images = category.webimage_set.all()
    context = {
        'name': category.category,
        'images': images
    }
    return render(request, 'albums/view.html', context)
