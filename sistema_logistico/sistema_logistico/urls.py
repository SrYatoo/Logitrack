from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    UsuarioViewSet, EnderecoViewSet, MaterialViewSet,
    SolicitacaoEnvioViewSet, ItemSolicitacaoViewSet, StatusEnvioViewSet,
    TransferenciaEstoqueViewSet, HistoricoMovimentacaoMaterialViewSet, BaixaDiretaMaterialViewSet
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet)
router.register(r'enderecos', EnderecoViewSet)
router.register(r'materiais', MaterialViewSet)
router.register(r'solicitacoes', SolicitacaoEnvioViewSet)
router.register(r'itens-solicitacao', ItemSolicitacaoViewSet)
router.register(r'status', StatusEnvioViewSet)
router.register(r'transferencias', TransferenciaEstoqueViewSet)
router.register(r'historico-movimentacoes', HistoricoMovimentacaoMaterialViewSet)
router.register(r'baixas-diretas', BaixaDiretaMaterialViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]

