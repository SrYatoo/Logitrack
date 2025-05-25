from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from .models import Usuario, Endereco, Material, SolicitacaoEnvio, ItemSolicitacao, StatusEnvio, TransferenciaEstoque, HistoricoMovimentacaoMaterial, BaixaDiretaMaterial
from .serializers import (
    UsuarioSerializer, EnderecoSerializer, MaterialSerializer, 
    SolicitacaoEnvioSerializer, ItemSolicitacaoSerializer, StatusEnvioSerializer, 
    TransferenciaEstoqueSerializer, HistoricoMovimentacaoMaterialSerializer, BaixaDiretaMaterialSerializer
)

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class EnderecoViewSet(viewsets.ModelViewSet):
    queryset = Endereco.objects.all()
    serializer_class = EnderecoSerializer

class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    @action(detail=True, methods=['patch'])
    def repor(self, request, pk=None):
        material = self.get_object()
        qtd = int(request.data.get('quantidade', 0))
        material.quantidade += qtd
        material.save()
        return Response({'mensagem': 'Estoque reposto com sucesso'})

    @action(detail=True, methods=['patch'])
    def entregar(self, request, pk=None):
        material = self.get_object()
        qtd = int(request.data.get('quantidade', 0))
        destino = request.data.get('localizacao', '')

        # Verifica se já existe esse material no destino
        existente = Material.objects.filter(
            nome=material.nome,
            categoria=material.categoria,
            cor=material.cor,
            genero=material.genero,
            tamanho=material.tamanho,
            localizacao=destino
        ).first()

        if existente:
            existente.quantidade += qtd
            existente.save()
        else:
            Material.objects.create(
                nome=material.nome,
                categoria=material.categoria,
                cor=material.cor,
                genero=material.genero,
                tamanho=material.tamanho,
                quantidade=qtd,
                localizacao=destino,
                observacao='Recebido via entrega de solicitação'
            )

        return Response({'mensagem': 'Material entregue ao destino com sucesso'})
    
class SolicitacaoEnvioViewSet(viewsets.ModelViewSet):
    queryset = SolicitacaoEnvio.objects.all()
    serializer_class = SolicitacaoEnvioSerializer

class ItemSolicitacaoViewSet(viewsets.ModelViewSet):
    queryset = ItemSolicitacao.objects.all()
    serializer_class = ItemSolicitacaoSerializer

class StatusEnvioViewSet(viewsets.ModelViewSet):
    queryset = StatusEnvio.objects.all()
    serializer_class = StatusEnvioSerializer

class TransferenciaEstoqueViewSet(viewsets.ModelViewSet):
    queryset = TransferenciaEstoque.objects.all()
    serializer_class = TransferenciaEstoqueSerializer

class HistoricoMovimentacaoMaterialViewSet(viewsets.ModelViewSet):
    queryset = HistoricoMovimentacaoMaterial.objects.all()
    serializer_class = HistoricoMovimentacaoMaterialSerializer

class BaixaDiretaMaterialViewSet(viewsets.ModelViewSet):
    queryset = BaixaDiretaMaterial.objects.all()
    serializer_class = BaixaDiretaMaterialSerializer
