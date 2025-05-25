import React, { useState } from 'react';
import axios from 'axios';

function NovoStatus({ solicitacoes, onStatusCriado }) {
  const [solicitacaoId, setSolicitacaoId] = useState('');
  const [status, setStatus] = useState('pendente');
  const [comentario, setComentario] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!solicitacaoId) {
      alert('Por favor, selecione uma solicitação.');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/status/', {
      solicitacao: solicitacaoId,
      status: status,
      comentario: comentario,
    })
    .then(response => {
      alert('Status atualizado com sucesso!');
      setSolicitacaoId('');
      setStatus('pendente');
      setComentario('');
      if (onStatusCriado) {
        onStatusCriado();
      }
    })
    .catch(error => {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status.');
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Atualizar Status de Envio</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Solicitação:</label><br />
          <select
            value={solicitacaoId}
            onChange={(e) => setSolicitacaoId(e.target.value)}
            required
          >
            <option value="">Selecione uma solicitação</option>
            {solicitacoes.map(solicitacao => (
              <option key={solicitacao.id} value={solicitacao.id}>
                #{solicitacao.id} - {solicitacao.destino}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Status:</label><br />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
            <option value="pendente">Pendente</option>
            <option value="em_separacao">Em Separação</option>
            <option value="em_transito">Em Trânsito</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        <div>
          <label>Comentário:</label><br />
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: '10px' }}>
          Atualizar Status
        </button>
      </form>
    </div>
  );
}

export default NovoStatus;
