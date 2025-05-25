import React, { useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Solicitacoes({ solicitacoes, onSolicitacaoExcluida, onStatusAtualizado }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');
  const [comentario, setComentario] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroRemetente, setFiltroRemetente] = useState('');
  const [filtroDestinatario, setFiltroDestinatario] = useState('');

  const abrirModal = (solicitacao) => {
    const ultimo = obterUltimoStatus(solicitacao);
    if (ultimo === 'cancelado') {
      alert('Não é possível editar o status de uma solicitação cancelada.');
      return;
    }
    setSolicitacaoSelecionada(solicitacao);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setSolicitacaoSelecionada(null);
    setNovoStatus('');
    setComentario('');
  };

  const atualizarStatus = async () => {
    if (!solicitacaoSelecionada || !novoStatus) return;

    const ultimo = obterUltimoStatus(solicitacaoSelecionada);

    // Regras para cancelar
    if (novoStatus === 'cancelado' && !['pendente', 'em_separacao'].includes(ultimo)) {
      alert('Só é possível cancelar se o status atual for "pendente" ou "em separacao".');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:8000/api/status/', {
        solicitacao: solicitacaoSelecionada.id,
        status: novoStatus,
        comentario,
      });

      if (novoStatus === 'cancelado') {
        for (const item of solicitacaoSelecionada.itens) {
          await axios.patch(`http://127.0.0.1:8000/api/materiais/${item.material}/repor/`, {
            quantidade: item.quantidade,
            localizacao: solicitacaoSelecionada.remetente_nome
          });
        }
      }

      if (novoStatus === 'entregue') {
        for (const item of solicitacaoSelecionada.itens) {
          await axios.patch(`http://127.0.0.1:8000/api/materiais/${item.material}/entregar/`, {
            quantidade: item.quantidade,
            localizacao: solicitacaoSelecionada.destinatario_nome
          });
        }
      }

      alert(`Status atualizado para "${novoStatus}"`);
      fecharModal();
      if (typeof onStatusAtualizado === 'function') {
        onStatusAtualizado(); // 🔁 Atualiza a lista no App.js
      }
      // Atualiza manualmente o status na lista sem reload
      const atualizados = solicitacoes.map(s => {
        if (s.id === solicitacaoSelecionada.id) {
          return {
            ...s,
            status: [...s.status, {
              status: novoStatus,
              data_status: new Date().toISOString(),
              comentario
            }]
          };
        }
        return s;
      });
      window.localStorage.setItem('solicitacoes', JSON.stringify(atualizados)); // opcional
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status');
    }
  };

  const obterUltimoStatus = (solicitacao) => {
    if (solicitacao.status && solicitacao.status.length > 0) {
      return solicitacao.status[solicitacao.status.length - 1].status;
    }
    return null;
  };
  
  const estiloFiltroSelect = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 4px rgba(0,0,0,0.1)',
    fontSize: '14px',
    minWidth: '200px',
    outline: 'none'
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Solicitações de Envio</h2>
      
      <div style={{
        display: 'flex',
        gap: '15px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
      <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={estiloFiltroSelect}>
        <option value="">Filtrar por status</option>
        <option value="pendente">Pendente</option>
        <option value="em_separacao">Em Separação</option>
        <option value="em_transito">Em Trânsito</option>
        <option value="entregue">Entregue</option>
        <option value="cancelado">Cancelado</option>
      </select>

      <select value={filtroRemetente} onChange={e => setFiltroRemetente(e.target.value)} style={estiloFiltroSelect}>
        <option value="">Filtrar por remetente</option> {[...new Set(solicitacoes.map(s => s.remetente_nome))].map((nome, i) => (
            <option key={i} value={nome}>{nome}</option>
          ))}
      </select>

        <select
          value={filtroDestinatario}
          onChange={e => setFiltroDestinatario(e.target.value)}
          style={estiloFiltroSelect}
        >
          <option value="">Filtrar por destinatário</option>
          {[...new Set(solicitacoes.map(s => s.destinatario_nome))].map((nome, i) => (
            <option key={i} value={nome}>{nome}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setFiltroStatus('');
            setFiltroRemetente('');
            setFiltroDestinatario('');
          }}
          style={{
            padding: '8px 10px',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '13px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            marginLeft: '5px'
          }}
          
        >
          <span>Limpar</span>
        </button>
      </div>
      


      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {solicitacoes
          .filter(s => !filtroStatus || obterUltimoStatus(s) === filtroStatus)
          .filter(s => !filtroRemetente || s.remetente_nome === filtroRemetente)
          .filter(s => !filtroDestinatario || s.destinatario_nome === filtroDestinatario)
          .map(solicitacao => (
          <div key={solicitacao.id} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            width: '300px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
            position: 'relative'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Solicitação #{solicitacao.id}</h3>
            <p><strong>Solicitante:</strong> {solicitacao.usuario_nome}</p>
            <p><strong>Remetente:</strong> {solicitacao.remetente_nome}</p>
            <p><strong>Destinatário:</strong> {solicitacao.destinatario_nome}</p>
            <p><strong>Destino:</strong> {solicitacao.destino}</p>
            <p><strong>Urgência:</strong> {solicitacao.nivel_urgencia}</p>
            <p><strong>Observação:</strong> {solicitacao.observacao || 'Nenhuma'}</p>
            <p><strong>Data:</strong> {new Date(solicitacao.data_criacao).toLocaleString()}</p>

            <div style={{ marginTop: '10px' }}>
              <strong>Materiais:</strong>
              <ul style={{ paddingLeft: '20px' }}>
                {solicitacao.itens.map((item, index) => (
                  <li key={index}>
                    {item.material_nome} - {item.quantidade} unid.
                  </li>
                ))}
              </ul>
            </div>

            {solicitacao.status.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <strong>Status:</strong>

                <select style={{ width: '100%', marginTop: '5px' }} value={obterUltimoStatus(solicitacao)} >
                  {solicitacao.status.map((statusItem, index) => (
                    <option key={index} value={statusItem.status}>
                      {statusItem.status} - {new Date(statusItem.data_status).toLocaleString()}
                      {statusItem.comentario ? ` (${statusItem.comentario})` : ''}
                    </option>
                  ))}
                </select>


              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button onClick={() => abrirModal(solicitacao)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <FaEdit color="#4CAF50" />
              </button>
              <button onClick={async () => {
                const ultimo = obterUltimoStatus(solicitacao);
                if (ultimo !== 'cancelado') {
                  alert('Só é possível excluir uma solicitação com status "cancelado".');
                  return;
                }

                const confirmacao = window.confirm('Tem certeza que deseja excluir esta solicitação?');
                if (confirmacao) {
                  try {
                    await axios.delete(`http://127.0.0.1:8000/api/solicitacoes/${solicitacao.id}/`);
                    alert('Solicitação excluída com sucesso.');
                    if (typeof onSolicitacaoExcluida === 'function') {
                      onSolicitacaoExcluida(solicitacao.id); // ✅ passa o ID da solicitação excluída
                    }

                  } catch (error) {
                    console.error('Erro ao excluir:', error);
                    alert('Erro ao excluir a solicitação.');
                  }
                }
              }}
  style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
>
  <FaTrash color="red" />
</button>

            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalAberto && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '400px',
            width: '100%'
          }}>
            <h3>Atualizar Status da Solicitação #{solicitacaoSelecionada?.id}</h3>
            <label>Status:</label>
            <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}>
            <option value="">Selecione...</option>
            <option value="pendente">Pendente</option>
            <option value="em_separacao">Em Separação</option>
            <option value="em_transito">Em Trânsito</option>
            <option value="entregue">Entregue</option>
            <option value="cancelado">Cancelado</option>
            </select>

            <label>Comentário:</label>
            <textarea value={comentario} onChange={(e) => setComentario(e.target.value)} style={{ width: '100%' }} />

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={fecharModal} style={{ backgroundColor: '#e0e0e0', color: '#333', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Cancelar</button>
              <button onClick={atualizarStatus} style={{ backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Solicitacoes;
