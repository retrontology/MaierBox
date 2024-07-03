from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from django.core.paginator import Paginator
from .models import Tag
from .util import validateTag
from django.shortcuts import render, get_object_or_404
from images.models import WebImage
from django.contrib.auth.decorators import login_required

MAX_TAGS = 100

@login_required
def index(request):

    if request.method != "GET":
        return HttpResponseNotAllowed(['GET'])
    
    page = request.GET["page"]
    if not page:
        page = 1
    
    paginator = Paginator(
        Tag.objects.order_by("tag"),
        per_page=MAX_TAGS,
    )

    page = paginator.page(page)

    data = {
        'tags': page.object_list
    }

    if page.has_next():
        data['next'] = page.next_page_number()

    return JsonResponse(
        status=200,
        data=data
    )

def view_images(request, tag:str):
    tag = get_object_or_404(Tag, tag=tag)
    images = tag.webimage_set.all()
    context = {
        'name': tag.tag,
        'images': images
    }
    return render(request, 'albums/view.html', context)
