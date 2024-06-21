from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from .models import *

def add(request):
    
    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    for field in WATERMARK_FIELDS:
        if not field in request.POST:
            return JsonErrorResponse(
                f'The "{field}" field is required'
            )
    
    data = {
        'created_by': request.user
    }
    for field in WATERMARK_FIELDS:
        data[field] = request.POST[field]
    watermark = Watermark(**data)
    watermark.save()

    return JsonResponse(
        status=200,
        data={
            'response': 'The watermark has been successfully added'
        }
    )

def create(request):
    return render(request, "watermarks/create.html")
