from django.http import JsonResponse, HttpResponseNotAllowed
from .models import Category, CATEGORY_MAX_LENGTH
from maierbox.util import JsonErrorResponse
from django.core.paginator import Paginator
from .util import validateCategory

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
            'The category field contains invalid characters'
        )

    if len(category) > CATEGORY_MAX_LENGTH:
        return JsonErrorResponse(
            f'The category "{category}" exceeds the maximum character length of {CATEGORY_MAX_LENGTH}'
        )

    category = Category.objects.filter(category=category).first()
    if category:
        return JsonErrorResponse(
            f'The category "{category}" already exists'
        )
    
    category = Category(
        creator=request.user,
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
            'The category field contains invalid characters'
        )

    if len(category) > CATEGORY_MAX_LENGTH:
        return JsonErrorResponse(
            f'The category "{category}" exceeds the maximum character length of {CATEGORY_MAX_LENGTH}'
        )

    category = Category.objects.filter(category=category).first()
    if not category:
        return JsonErrorResponse(
            f'The category "{category}" does not exist'
        )
    
    category.delete()

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
