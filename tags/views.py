from django.http import JsonResponse, HttpResponseNotAllowed
from maierbox.util import JsonErrorResponse
from django.core.paginator import Paginator
from .models import Tag
from .util import validateTag
from django.shortcuts import render, get_object_or_404
from images.models import WebImage


MAX_TAGS = 100

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
    if len(failed) > 0:
        return JsonErrorResponse(
            f'The following tags failed validation: {", ".join(failed)}'
        )

    exists = []
    for tag in tags:
        if Tag.objects.filter(tag=tag).exists():
            exists.append(tag)
    if len(exists) > 0:
        return JsonErrorResponse(
            f'The following tags already exist: {", ".join(failed)}'
        )

    for tag in tags:
        Tag(
            created_by=request.user,
            tag=tag,
        ).save()

    return JsonResponse(
        status=200,
        data={
            'response': f'The following tags have been added successfully: {", ".join(tags)}'
        }
    )


def remove(request, tag):

    if request.method != "DELETE":
        return HttpResponseNotAllowed(['DELETE'])
    
    tag = tag.lower()


    if not validateTag(tag):
        return JsonErrorResponse(
            f'The tag {tag} failed validation'
        )
        

    tag_obj = Tag.objects.filter(tag=tag).first()
    if not tag_obj:
        return JsonErrorResponse(
            f'The tag {tag} does not exist'
        )

    tag_obj.delete()
    
    return JsonResponse(
        status=200,
        data={
            'response': f'The tag "{tag}" has been removed successfully'
        }
    )
    
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
