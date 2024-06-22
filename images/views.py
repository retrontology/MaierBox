from django.shortcuts import render, HttpResponse
from django.http import JsonResponse, HttpResponseNotAllowed
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth.decorators import login_required
from watermarks.models import Watermark
from .models import *
from io import BytesIO
from PIL import Image
from uuid import uuid4
from .util import gen_thumbnail

def view(request):
    pass

@login_required
def upload(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    if not 'image' in request.FILES:
        HttpResponse(status=400)

    if 'watermark' in request.POST:
        watermark = Watermark.objects.get('watermark')
    else:
        watermark = Watermark.objects.first()
    
    uploaded = request.FILES['image']
    id = uuid4()
    new_name = f'{id}.jpg'

    fields = {
        'id': id
    }

    if 'category' in request.POST:
        fields['category'] = request.POST['category']
    else:
        fields['category'] = None
    
    if 'tags' in request.POST:
        fields['tags'] = request.POST['tags']

    image_bytes = BytesIO(uploaded.read())
    image = Image.open(image_bytes)

    thumbnail_data = gen_thumbnail(image)
    thumbnail = InMemoryUploadedFile(
        thumbnail_data,
        'thumbnail',
        new_name,
        'JPEG',
        None,
        None
    )
    fields['thumbnail'] = thumbnail

    image = watermark.draw(image)
    fields['watermark'] = watermark

    jpeg_data = BytesIO()
    image.save(
        jpeg_data,
        'jpeg',
        subsampling=ORIGINAL_SUBSAMPLING,
        quality=ORIGINAL_QUALITY
    )
    jpeg = InMemoryUploadedFile(
        jpeg_data,
        'resized',
        new_name,
        'JPEG',
        None,
        None
    )
    fields['original'] = jpeg

    if any(lambda x: x > SCALED_MAX for x in image.size):
        scaled = image.copy()
        scaled.thumbnail(
            (SCALED_MAX,SCALED_MAX),
            Image.LANCZOS
        )
        scaled_data = BytesIO()
        scaled.save(
            scaled_data,
            'jpeg',
            subsampling=SCALED_SUBSAMPLING,
            quality=SCALED_QUALITY
        )
        scaled = InMemoryUploadedFile(
            scaled_data,
            'resized',
            new_name,
            'JPEG',
            None,
            None
        )
        fields['scaled'] = scaled
    else:
        fields['scaled'] = None
    
    fields['name'] = uploaded.name
    fields['uploader'] = request.user

    WebImage(**fields).save()
    
    return JsonResponse(
        status=200,
        data={
            'response': f'Image {id} successfully uploaded'
        }
    )

def add(request):
    return render(request, 'images/add.html')
