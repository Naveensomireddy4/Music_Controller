# Generated by Django 5.0.4 on 2024-05-19 10:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='guest_can_pass',
            new_name='guest_can_pause',
        ),
    ]
