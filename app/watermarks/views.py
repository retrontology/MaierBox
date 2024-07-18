from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed, HttpRequest
from django.core.paginator import Paginator
from maierbox.util import JsonErrorResponse
from .models import Watermark, Font, WATERMARK_FIELDS
from django.contrib.auth.decorators import login_required

MAX_WATERMARKS=100

@login_required
def list(request: HttpRequest):

    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    if 'page' in request.GET:
        page = request.GET['page']
    else:
        page = 1
    
    paginator = Paginator(
        Watermark.objects.order_by("id"),
        per_page=MAX_WATERMARKS,
    )

    page = paginator.page(page)

    data = {
        'items': [
            {
                'id': watermark.id,
                'text': watermark.text,
            } for watermark in page.object_list.all()
        ]
    }

    if page.has_next():
        data['next'] = page.next_page_number()

    return JsonResponse(
        status=200,
        data=data
    )

@login_required
def add(request: HttpRequest):
    
    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    for field in WATERMARK_FIELDS:
        if not field in request.POST:
            return JsonErrorResponse(
                f'The "{field}" field is required'
            )
    
    data = {
        'created_by': request.user,
    }
    for field in WATERMARK_FIELDS:
        data[field] = request.POST[field]
    data['font'] = Font.objects.filter(id=request.POST['font']).first()
    watermark = Watermark(**data)
    watermark.save()

    return JsonResponse(
        status=200,
        data={
            'response': 'The watermark has been successfully added'
        }
    )

@login_required
def create(request: HttpRequest):
    if not Font.objects.first():
        Font.populateFonts()
    context = {
        'fonts': Font.objects.all()
    }
    return render(request, "watermarks/create.html", context)
