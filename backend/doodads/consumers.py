import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from doodads.models import Doodad


class DoodadsConsumer(AsyncWebsocketConsumer):
    async def _send_initial_data(self):
        doodads = await sync_to_async(Doodad.objects.all)()
        serialized_doodads = await sync_to_async(lambda: [doodad.serialize() for doodad in doodads])()
        await self.send(text_data=json.dumps({'type': 'doodads.all', 'doodads': serialized_doodads}))

    async def connect(self):
        print('DooodadsConsumer: connect')
        await self.accept()
        await self._send_initial_data()
        await self.channel_layer.group_add('doodads_group', self.channel_name)

    async def disconnect(self, close_code):
        print(f'DooodadsConsumer: disconnect, close_code {close_code}')
        await self.channel_layer.group_discard('doodads_group', self.channel_name)

    async def doodad_update(self, event):
        doodad = event['doodad']
        await self.send(text_data=json.dumps({
            'type': 'doodads.update',
            'doodad': doodad,
        }))
