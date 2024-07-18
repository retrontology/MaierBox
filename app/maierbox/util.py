from django.http import JsonResponse

class JsonErrorResponse(JsonResponse):
    def __init__(self, data: str, *args, **kwargs) -> None:
        kwargs['status'] = 400
        data = {'error': data}
        super().__init__(data, *args, **kwargs)
