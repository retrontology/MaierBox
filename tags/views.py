from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from .models import Tag
from .util import validateTag

def add(request):

    if request.method != "POST":
        return HttpResponseNotAllowed(['POST'])

    if 'tags' not in request.POST:
        return JsonErrorResponse(
            'The tags field must be included in the request'
        )
    
    tags = [x.lower() for x in request.POST['tags']]
    failed = []
    for tag in tags:
        if not validateTag(tag):
            failed.append(tag)
    if failed:
        return JsonErrorResponse(
            f'The following tags failed validation: {", ".join(failed)}'
        )

    # Start here    
    if Tag.objects.get(request.POST['category']):
        request.POST['category']
    

def remove(request):
    pass

def index(request):
    pass
