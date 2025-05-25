from rest_framework import serializers
from .models import Usuario, Endereco, Material, SolicitacaoEnvio, ItemSolicitacao, StatusEnvio, TransferenciaEstoque, HistoricoMovimentacaoMaterial, BaixaDiretaMaterial

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class EnderecoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Endereco
        fields = '__all__'

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'

class ItemSolicitacaoSerializer(serializers.ModelSerializer):
    material_nome = serializers.CharField(source='material.nome', read_only=True)

    class Meta:
        model = ItemSolicitacao
        fields = ['id', 'material', 'material_nome', 'quantidade', 'solicitacao']

class StatusEnvioSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusEnvio
        fields = '__all__'

class SolicitacaoEnvioSerializer(serializers.ModelSerializer):
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)
    remetente_nome = serializers.CharField(source='remetente.nome', read_only=True)
    destinatario_nome = serializers.CharField(source='destinatario.nome', read_only=True)
    status = StatusEnvioSerializer(many=True, read_only=True)
    itens = ItemSolicitacaoSerializer(many=True, read_only=True)

    class Meta:
        model = SolicitacaoEnvio
        fields = [
            'id', 'usuario', 'usuario_nome', 
            'remetente', 'remetente_nome', 
            'destinatario', 'destinatario_nome', 
            'destino', 'descricao_material', 'nivel_urgencia', 
            'data_criacao', 'prazo_entrega', 'observacao',
            'status', 'itens'
        ]
        read_only_fields = ['id', 'usuario_nome', 'remetente_nome', 'destinatario_nome', 'data_criacao', 'status', 'itens']

class TransferenciaEstoqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransferenciaEstoque
        fields = '__all__'

class HistoricoMovimentacaoMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricoMovimentacaoMaterial
        fields = '__all__'

class BaixaDiretaMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaixaDiretaMaterial
        fields = '__all__'
