from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Doodad

channel_layer = get_channel_layer()


@receiver(post_save, sender=Doodad)
def send_doodad_update(sender, instance, **kwargs):
    async_to_sync(channel_layer.group_send)(
        'doodads_group',
        {
            'type': 'doodad_update',
            'doodad': instance.serialize(),
        }
    )
