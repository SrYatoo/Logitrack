from django.contrib import admin
from .models import Usuario, SolicitacaoEnvio, StatusEnvio

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nome', 'email', 'tipo')

@admin.register(SolicitacaoEnvio)
class SolicitacaoEnvioAdmin(admin.ModelAdmin):
    list_display = ('id', 'usuario', 'destino', 'data_criacao')

@admin.register(StatusEnvio)
class StatusEnvioAdmin(admin.ModelAdmin):
    list_display = ('id', 'solicitacao', 'status', 'data_status')


