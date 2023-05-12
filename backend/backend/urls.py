from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    # So WS URLs would show up when doing python manage.py show_urls
    path('', include('doodads.routing')),
    path('admin/', admin.site.urls),
]
