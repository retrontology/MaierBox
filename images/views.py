from django.shortcuts import render, HttpResponse
from .models import Image, Tag, Category
from .forms import ImageForm, TagForm, CategoryForm

def view(request):
    pass

def upload(request):
    form = ImageForm(request.POST, request.FILES)
    if form.is_valid():
        form_obj = form.save(commit=False)
        form_obj.name = request.FILES['image'].name
        form_obj.save()
        return HttpResponse(status=204)
    else:
        return HttpResponse(status=400)

def add(request):
    return render(request, 'images/add.html', {'form': ImageForm()})

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