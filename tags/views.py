from django.http import JsonResponse
from .models import Tag

def add(request):
    if 'category' not in request.POST:
        return JsonResponse(
            status=400,
            data={
                'error': 'The category field must be included in the request'
            }
        )
    
    if Tag.objects.get(request.POST['category']):
        request.POST['category']
    

def remove(request):
    pass

def index(request):
    pass
