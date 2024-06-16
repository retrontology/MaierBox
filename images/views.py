from django.shortcuts import render, HttpResponse
from .models import Image, Tag, Category
from .forms import ImageForm

def view(request):
    pass

def upload(request):
    form = ImageForm(request.POST, request.FILES)
    if form.is_valid():
        form.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=400)
