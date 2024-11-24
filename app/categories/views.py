from django.http import JsonResponse, HttpResponseNotAllowed, HttpRequest
from maierbox.util import JsonErrorResponse
from django.shortcuts import render, get_object_or_404
from .models import Category
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
from django.db.models import Count

MAX_CATEGORIES=100

@login_required
def list(request: HttpRequest):

    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    if 'page' in request.GET:
        page = request.GET['page']
    else:
        page = 1
    
    paginator = Paginator(
        Category.objects.order_by("category"),
        per_page=MAX_CATEGORIES,
    )

    page = paginator.page(page)

    data = {
        'items': [x.__str__() for x in page.object_list.all()]
    }

    if page.has_next():
        data['next'] = page.next_page_number()

    return JsonResponse(
        status=200,
        data=data
    )

@login_required
def add_category(request: HttpRequest):
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

def image_index(request: HttpRequest):
    categories = Category.objects.annotate(num_images=Count("webimage"))
    categories = categories.filter(num_images__gt=0).order_by('-num_images')
    context = {
        'categories': categories
    }
    return render(request, 'categories/images_index.html', context)

def view_images(request: HttpRequest, category:str):
    category = get_object_or_404(Category, category=category)
    images = category.webimage_set.all().order_by('date_created')
    context = {
        'name': category.category,
        'images': images
    }
    return render(request, 'albums/view.html', context)
