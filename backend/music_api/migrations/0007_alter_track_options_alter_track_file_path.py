# Generated by Django 5.1.5 on 2025-03-25 23:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('music_api', '0006_alter_yandexaccount_options_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='track',
            options={'verbose_name': 'Трек', 'verbose_name_plural': 'Треки'},
        ),
        migrations.AlterField(
            model_name='track',
            name='file_path',
            field=models.URLField(blank=True, max_length=500, verbose_name='URL аудио файла'),
        ),
    ]
