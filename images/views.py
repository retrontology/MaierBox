from django.shortcuts import render, get_object_or_404
from maierbox.util import JsonErrorResponse
from django.http import JsonResponse, HttpResponseNotAllowed
from django.contrib.auth.decorators import login_required
from watermarks.models import Watermark
from .models import *
from categories.models import Category
from tags.models import Tag

def view(request, id):
    image = get_object_or_404(WebImage, id=id)
    context = {'image': image}
    return render(request, 'images/view.html', context)

@login_required
def upload(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    if not 'image' in request.FILES:
        JsonErrorResponse(
            data='The "image" field/file is required'
        )

    fields = {
        'image': request.FILES['image'],
    }

    if 'category' in request.POST:
        fields['category'] = Category.objects.get(category=request.POST['category'])
    else:
        fields['category'] = None
    
    if 'tags' in request.POST:
        fields['tags'] = []
        for tag in request.POST['tags']:
            fields['tags'].append(Tag.objects.get(tag=tag))
    else:
        fields['tags'] = None
    
    if 'watermark' in request.POST:
        fields['watermark'] = Watermark.objects.get(request.POST['watermark'])
    else:
        fields['watermark'] = None

    image = WebImage.from_image(**fields)
    image.save()
    
    return JsonResponse(
        status=200,
        data={
            'response': image.id
        }
    )

def add(request):
    return render(request, 'images/add.html')
