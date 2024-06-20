from django.shortcuts import render, HttpResponse
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.contrib.auth.decorators import login_required
from .models import WebImage, Tag, Category, Watermark, ORIGINAL_SUBSAMPLING, ORIGINAL_QUALITY, SCALED_MAX, THUMBNAIL_MAX, SCALED_SUBSAMPLING, SCALED_QUALITY, THUMBNAIL_SUBSAMPLING, THUMBNAIL_QUALITY
from .forms import TagForm, CategoryForm
from PIL import Image
from io import BytesIO
from uuid import uuid4
from .util import gen_thumbnail

def view(request):
    pass

@login_required
def upload(request):

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
    
    return HttpResponse(status=204)

def add(request):
    return render(request, 'images/add.html')

def add_tag(request):

    form = TagForm(request.POST)

    if form.is_valid():
        form.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=400)
    
def add_category(request):
    form = CategoryForm(request.POST)
    if form.is_valid():
        form.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=400)