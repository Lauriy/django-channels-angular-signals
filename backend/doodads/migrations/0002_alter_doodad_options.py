# Generated by Django 4.2.1 on 2023-05-12 19:57

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('doodads', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='doodad',
            options={'ordering': ['-created_at']},
        ),
    ]
