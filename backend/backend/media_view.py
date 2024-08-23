import os

from django.conf import settings
from django.http import FileResponse, Http404
from django.utils.http import http_date
from django.views.decorators.cache import cache_control


@cache_control(no_cache=True)
def serve_media(request, path):
    media_path = os.path.join(settings.MEDIA_ROOT, path)

    if not os.path.exists(media_path):
        raise Http404("Media file not found")

    response = FileResponse(open(media_path, 'rb'))
    response['url'] = media_path
    response['Last-Modified'] = http_date(os.path.getmtime(media_path))
    return response
