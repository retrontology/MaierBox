from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from .models import *
from django.contrib.auth.decorators import login_required


@login_required
def add(request):
    
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
def create(request):
    if not Font.objects.first():
        Font.populateFonts()
    context = {
        'fonts': Font.objects.all()
    }
    return render(request, "watermarks/create.html", context)

@login_required
def list(request):
    if request.method != 'GET':
        return HttpResponseNotAllowed('GET')
    response = {
        'watermarks': {}
    }
    for watermark in Watermark.objects.all():
        response['watermarks'][watermark.id] = {
            'text': watermark.text,
        }
    return JsonResponse(response)
