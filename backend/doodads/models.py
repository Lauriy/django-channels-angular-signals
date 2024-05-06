from django.db.models import Model, CharField, DateTimeField


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
