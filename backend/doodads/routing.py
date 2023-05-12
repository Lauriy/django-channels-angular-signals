from django.urls import re_path

from . import consumers

urlpatterns = [
    re_path(r"ws/doodads-stream/", consumers.DoodadsConsumer.as_asgi()),
]
