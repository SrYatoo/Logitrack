from django.db import models

class Usuario(models.Model):
    TIPO_CHOICES = [
        ('solicitante', 'Solicitante'),
        ('logistica', 'Logística'),
        ('admin', 'Administrador'),
    ]
    nome = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    senha = models.CharField(max_length=128)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'


class Endereco(models.Model):
    nome = models.CharField(max_length=100)  # Ex.: Centro Logístico SP, Loja XPTO, Cliente João
    endereco = models.CharField(max_length=255)
    bairro = models.CharField(max_length=100)
    cidade = models.CharField(max_length=100)
    uf = models.CharField(max_length=2)  # Ex.: SP, RJ
    cep = models.CharField(max_length=10)
    regiao = models.CharField(max_length=20)  # Norte, Nordeste, etc.

    def __str__(self):
        return f"{self.nome} - {self.cidade}/{self.uf}"


class Material(models.Model):
    localizacao = models.CharField(max_length=100)
    categoria = models.CharField(max_length=100)
    nome = models.CharField(max_length=100)
    cor = models.CharField(max_length=50, blank=True)
    genero = models.CharField(max_length=50, blank=True)
    tamanho = models.CharField(max_length=20, blank=True)
    quantidade = models.PositiveIntegerField()
    observacao = models.TextField(blank=True)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.nome} ({self.categoria}) - {self.localizacao}"


class SolicitacaoEnvio(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    remetente = models.ForeignKey(Endereco, related_name='remetente_solicitacoes', on_delete=models.CASCADE, null=True, blank=True)
    destinatario = models.ForeignKey(Endereco, related_name='destinatario_solicitacoes', on_delete=models.CASCADE, null=True, blank=True)
    destino = models.CharField(max_length=200)
    descricao_material = models.TextField(blank=True)  # 🔵 Deixei blank=True porque agora focamos nos itens
    nivel_urgencia = models.CharField(
        max_length=10,
        choices=[('baixa', 'Baixa'), ('media', 'Média'), ('alta', 'Alta')],
        default='media'
    )
    data_criacao = models.DateTimeField(auto_now_add=True)
    prazo_entrega = models.DateField(blank=True, null=True)
    observacao = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Solicitação #{self.id} para {self.destino}"

    class Meta:
        verbose_name = 'Solicitação de envio'
        verbose_name_plural = 'Solicitações de envio'


class ItemSolicitacao(models.Model):
    solicitacao = models.ForeignKey(SolicitacaoEnvio, on_delete=models.CASCADE, related_name='itens')
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.quantidade}x {self.material.nome}"


class StatusEnvio(models.Model):
    STATUS_CHOICES = [
        ('pendente', 'Pendente'),
        ('em_separacao', 'Em Separação'),
        ('em_transito', 'Em Trânsito'),
        ('entregue', 'Entregue'),
        ('cancelado', 'Cancelado'),
    ]
    solicitacao = models.ForeignKey(SolicitacaoEnvio, on_delete=models.CASCADE, related_name='status')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    data_status = models.DateTimeField(auto_now_add=True)
    comentario = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.status} ({self.data_status:%d/%m/%Y %H:%M})"

    class Meta:
        verbose_name = 'Status de envio'
        verbose_name_plural = 'Status de envio'


class TransferenciaEstoque(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    origem = models.CharField(max_length=100)
    destino = models.CharField(max_length=100)
    data_transferencia = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.quantidade}x {self.material.nome} - {self.origem} ➔ {self.destino}"


class HistoricoMovimentacaoMaterial(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    tipo_movimentacao = models.CharField(max_length=20)  # Cadastro, Edição, Exclusão
    motivo = models.CharField(max_length=255)
    descricao_outro = models.TextField(blank=True)  # Se for "Outro"
    usuario_responsavel = models.CharField(max_length=100)
    data_movimentacao = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tipo_movimentacao} - {self.material.nome} ({self.usuario_responsavel})"


class BaixaDiretaMaterial(models.Model):
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantidade = models.PositiveIntegerField()
    nome_retirada = models.CharField(max_length=100)
    cpf_retirada = models.CharField(max_length=14)
    cargo_retirada = models.CharField(max_length=100)
    empresa_retirada = models.CharField(max_length=100)
    data_retirada = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.nome_retirada} retirou {self.quantidade}x {self.material.nome}"
