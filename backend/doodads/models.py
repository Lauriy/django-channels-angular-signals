from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models import Model, CharField, DateTimeField
from django.db.models.signals import post_save
from django.dispatch import receiver

channel_layer = get_channel_layer()


class Doodad(Model):
    name = CharField(max_length=255)
    state = CharField(max_length=32)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Doodad {self.id}: {self.name}'

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'state': self.state,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }


@receiver(post_save, sender=Doodad)
def send_doodad_update(sender, instance, **kwargs):
    async_to_sync(channel_layer.group_send)(
        'doodads_group',
        {
            'type': 'doodad_update',
            'doodad': instance.serialize(),
        }
    )
