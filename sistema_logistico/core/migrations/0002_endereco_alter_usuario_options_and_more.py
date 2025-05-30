# Generated by Django 5.2 on 2025-04-27 17:16

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Endereco',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('endereco', models.CharField(max_length=255)),
                ('bairro', models.CharField(max_length=100)),
                ('cidade', models.CharField(max_length=100)),
                ('uf', models.CharField(max_length=2)),
                ('cep', models.CharField(max_length=10)),
                ('regiao', models.CharField(max_length=20)),
            ],
        ),
        migrations.AlterModelOptions(
            name='usuario',
            options={'verbose_name': 'Usuario', 'verbose_name_plural': 'Usuarios'},
        ),
        migrations.AddField(
            model_name='solicitacaoenvio',
            name='nivel_urgencia',
            field=models.CharField(choices=[('baixa', 'Baixa'), ('media', 'Média'), ('alta', 'Alta')], default='media', max_length=10),
        ),
        migrations.AddField(
            model_name='solicitacaoenvio',
            name='prazo_entrega',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='statusenvio',
            name='status',
            field=models.CharField(choices=[('pendente', 'Pendente'), ('em_separacao', 'Em Separação'), ('em_transito', 'Em Trânsito'), ('entregue', 'Entregue')], max_length=20),
        ),
        migrations.AddField(
            model_name='solicitacaoenvio',
            name='destinatario',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='destinatario_solicitacoes', to='core.endereco'),
        ),
        migrations.AddField(
            model_name='solicitacaoenvio',
            name='remetente',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='remetente_solicitacoes', to='core.endereco'),
        ),
    ]
