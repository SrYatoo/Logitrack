import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Usuarios({ usuarioLogado }) {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [modoSenha, setModoSenha] = useState(null); // ID do usuário alterando senha

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = () => {
    axios.get('http://127.0.0.1:8000/api/usuarios/')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Erro ao buscar usuários:', err));
  };

  const corTipo = (tipo) => {
    switch (tipo) {
      case 'admin': return '#1976d2';
      case 'logistica': return '#388e3c';
      case 'solicitante': default: return '#757575';
    }
  };

  const iniciarEdicao = (u) => {
    setEditandoId(u.id);
    setFormEdicao({ nome: u.nome, email: u.email, tipo: u.tipo });
    setModoSenha(null);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormEdicao({});
  };

  const salvarEdicao = (id, tipoOriginal) => {
    const novoTipo = formEdicao.tipo;

    if ((usuarioLogado.tipo !== 'admin') && tipoOriginal === 'admin') {
      alert('Você não tem permissão para editar um usuário admin.');
      return;
    }

    if ((usuarioLogado.tipo !== 'admin') && novoTipo === 'admin') {
      alert('Você não pode alterar seu tipo para admin.');
      return;
    }

    axios.put(`http://127.0.0.1:8000/api/usuarios/${id}/`, formEdicao)
      .then(() => {
        cancelarEdicao();
        carregarUsuarios();
      });
  };

  const excluirUsuario = (id, tipo) => {
    if ((tipo === 'admin') && usuarioLogado.tipo !== 'admin') {
      alert('Você não pode excluir um admin.');
      return;
    }
    if (!window.confirm('Deseja realmente excluir este usuário?')) return;

    axios.delete(`http://127.0.0.1:8000/api/usuarios/${id}/`)
      .then(() => carregarUsuarios());
  };

  const alterarSenha = (id, tipo) => {
    if (tipo === 'admin' && usuarioLogado.tipo !== 'admin') {
      alert('Você não pode alterar a senha de um admin.');
      return;
    }

    if (usuarioLogado.tipo === 'admin' || senhaAtual.trim() !== '') {
      const payload = { senha: novaSenha };
      if (usuarioLogado.tipo !== 'admin') payload.senha_atual = senhaAtual;

      axios.put(`http://127.0.0.1:8000/api/usuarios/${id}/alterar_senha/`, payload)
        .then(() => {
          alert('Senha alterada com sucesso!');
          setModoSenha(null);
          setSenhaAtual('');
          setNovaSenha('');
        })
        .catch(() => alert('Erro ao alterar senha. Verifique a senha atual.'));
    } else {
      alert('Preencha a senha atual.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Usuários Cadastrados</h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {usuarios.map((u) => (
          <div key={u.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#fff',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
          }}>
            {editandoId === u.id ? (
              <>
                <label>Nome:</label>
                <input value={formEdicao.nome} onChange={(e) => setFormEdicao({ ...formEdicao, nome: e.target.value })} style={inputStyle} />
                <label>Email:</label>
                <input value={formEdicao.email} onChange={(e) => setFormEdicao({ ...formEdicao, email: e.target.value })} style={inputStyle} />
                <label>Tipo:</label>
                <select value={formEdicao.tipo} onChange={(e) => setFormEdicao({ ...formEdicao, tipo: e.target.value })} style={inputStyle}>
                  <option value="admin">admin</option>
                  <option value="logistica">logistica</option>
                  <option value="solicitante">solicitante</option>
                </select>

                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => salvarEdicao(u.id, u.tipo)} style={btn('green')}>Salvar</button>
                  <button onClick={cancelarEdicao} style={btn('gray')}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h4>{u.nome}</h4>
                <p><strong>Email:</strong> {u.email}</p>
                <p>
                  <strong>Tipo:</strong>
                  <span style={{
                    backgroundColor: corTipo(u.tipo),
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '5px',
                    marginLeft: '8px'
                  }}>{u.tipo}</span>
                </p>

                {/* Ações */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(usuarioLogado.tipo === 'admin' || u.id === usuarioLogado.id) && (
                    <>
                      <button onClick={() => iniciarEdicao(u)} style={btn('green')}>Editar</button>
                      <button onClick={() => excluirUsuario(u.id, u.tipo)} style={btn('red')}>Excluir</button>
                      <button onClick={() => setModoSenha(modoSenha === u.id ? null : u.id)} style={btn('blue')}>Alterar Senha</button>
                    </>
                  )}
                </div>
              </>
            )}

            {/* Seção de alteração de senha */}
            {modoSenha === u.id && (
              <div style={{ marginTop: '10px' }}>
                {usuarioLogado.tipo !== 'admin' && (
                  <>
                    <label>Senha Atual:</label>
                    <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} style={inputStyle} />
                  </>
                )}
                <label>Nova Senha:</label>
                <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} style={inputStyle} />
                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                  <button onClick={() => alterarSenha(u.id, u.tipo)} style={btn('green')}>Salvar Senha</button>
                  <button onClick={() => setModoSenha(null)} style={btn('gray')}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 Estilos auxiliares
const inputStyle = {
  width: '100%',
  padding: '6px',
  marginBottom: '6px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const btn = (cor) => {
  const cores = {
    green: '#4CAF50',
    red: '#f44336',
    blue: '#1976d2',
    gray: '#888'
  };
  return {
    backgroundColor: cores[cor],
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer'
  };
};

export default Usuarios;
