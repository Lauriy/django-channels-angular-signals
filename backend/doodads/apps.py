from django.apps import AppConfig


class DoodadsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'doodads'

    def ready(self):
        from . import signals
        assert signals.send_doodad_update
