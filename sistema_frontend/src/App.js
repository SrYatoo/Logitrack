import React, { useState, useEffect } from 'react';
import { FaHome, FaPlus, FaListAlt, FaUsers, FaTruck, FaWarehouse, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import NovaSolicitacao from './NovaSolicitacao';
//import NovoStatus from './NovoStatus';
//<MenuButton icone={<FaTruck />} texto="Atualizar Status" ativo={paginaAtual === 'novo-status'} onClick={() => setPaginaAtual('novo-status')} />
// {paginaAtual === 'novo-status' && <NovoStatus solicitacoes={solicitacoes} onStatusCriado={carregarSolicitacoes} />}
import NovoEndereco from './NovoEndereco';
import NovoMaterial from './NovoMaterial';
import Usuarios from './Usuarios';
import Solicitacoes from './Solicitacoes';
import Login from './Login';
import Loading from './Loading'; // 👈 novo
import Dashboard from './Dashboard';

function App() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState('inicio');
  const [fadeOut, setFadeOut] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 novo

  const carregarSolicitacoes = () => {
    setLoading(true); // 👈 novo
    axios.get('http://127.0.0.1:8000/api/solicitacoes/')
      .then(response => setSolicitacoes(response.data))
      .catch(error => console.error('Erro ao buscar solicitações:', error))
      .finally(() => setLoading(false)); // 👈 novo
  };
  
  const removerSolicitacaoDaLista = (idExcluido) => {
    setSolicitacoes(prev => prev.filter(s => s.id !== idExcluido));
  };
  
  useEffect(() => {
    if (usuarioLogado) {
      carregarSolicitacoes();
    }
  }, [usuarioLogado]);

  const logout = () => {
    setFadeOut(true);
    setTimeout(() => {
      setUsuarioLogado(null);
      setPaginaAtual('inicio');
      setFadeOut(false);
    }, 500);
  };

  if (!usuarioLogado) {
    return <Login onLoginSuccess={setUsuarioLogado} />;
  }

  if (loading) {
    return <Loading />; // 👈 Mostra carregamento enquanto busca
  }

  return (
    <div style={{ display: 'flex', height: '100vh', opacity: fadeOut ? 0.5 : 1, transition: 'opacity 0.5s ease' }}>
      
      {/* Menu lateral */}
      <div style={sidebarStyle}>
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>🚚 LogiTrack</h2>
          <small>{usuarioLogado.nome} ({usuarioLogado.tipo})</small>
        </div>

        <MenuButton icone={<FaHome />} texto="Início" ativo={paginaAtual === 'inicio'} onClick={() => setPaginaAtual('inicio')} />
        <MenuButton icone={<FaPlus />} texto="Nova Solicitação" ativo={paginaAtual === 'nova-solicitacao'} onClick={() => setPaginaAtual('nova-solicitacao')} />
        
        <MenuButton icone={<FaWarehouse />} texto="Unidades" ativo={paginaAtual === 'novo-endereco'} onClick={() => setPaginaAtual('novo-endereco')} />
        <MenuButton icone={<FaWarehouse />} texto="Materiais" ativo={paginaAtual === 'novo-material'} onClick={() => setPaginaAtual('novo-material')} />
        <MenuButton icone={<FaUsers />} texto="Usuários" ativo={paginaAtual === 'usuarios'} onClick={() => setPaginaAtual('usuarios')} />
        <MenuButton icone={<FaListAlt />} texto="Solicitações" ativo={paginaAtual === 'solicitacoes'} onClick={() => setPaginaAtual('solicitacoes')} />

        <div style={{ marginTop: 'auto' }}>
          <MenuButton icone={<FaSignOutAlt />} texto="Logout" ativo={false} onClick={logout} />
        </div>
      </div>

      {/* Conteúdo da página */}
      <div style={contentStyle}>
        {paginaAtual === 'inicio' && (
          <div style={homeBoxStyle}>
            <h1>Bem-vindo ao Sistema Logístico! 🚚</h1>
            <p style={{ marginTop: '10px', fontSize: '18px' }}>
              Organize seus envios com eficiência e rapidez!
            </p>
            <Dashboard /> {/* 👈 Aqui entra o dashboard abaixo do texto */}
          </div>
        )}
        {paginaAtual === 'nova-solicitacao' && <NovaSolicitacao onSolicitacaoCriada={carregarSolicitacoes} usuarioLogado={usuarioLogado} />}
        
        {paginaAtual === 'novo-endereco' && <NovoEndereco />}
        {paginaAtual === 'novo-material' && <NovoMaterial />}
        {paginaAtual === 'usuarios' && <Usuarios usuarioLogado={usuarioLogado} />}
        {paginaAtual === 'solicitacoes' && (<Solicitacoes solicitacoes={solicitacoes} onSolicitacaoExcluida={removerSolicitacaoDaLista} onStatusAtualizado={carregarSolicitacoes}/>)}

      </div>
    </div>
  );
}

// 🎨 Estilo do menu lateral
const sidebarStyle = {
  width: '250px',
  backgroundColor: '#1F2937',
  color: '#ffffff',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
};

// 🎨 Estilo da área de conteúdo
const contentStyle = {
  flex: 1,
  padding: '40px',
  backgroundColor: '#f3f4f6',
  overflowY: 'auto',
};

// 🎨 Caixa inicial de boas-vindas
const homeBoxStyle = {
  backgroundColor: '#ffffff',
  padding: '30px',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

// 🎨 Botão do menu lateral
function MenuButton({ icone, texto, ativo, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        backgroundColor: ativo ? '#4CAF50' : 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        padding: '10px',
        width: '100%',
        textAlign: 'left',
        borderRadius: '5px',
        transition: '0.3s',
        marginBottom: '8px'
      }}
      onMouseOver={(e) => e.target.style.backgroundColor = ativo ? '#4CAF50' : '#374151'}
      onMouseOut={(e) => e.target.style.backgroundColor = ativo ? '#4CAF50' : 'transparent'}
    >
      {icone} {texto}
    </button>
  );
}

export default App;
