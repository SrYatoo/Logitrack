import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut, Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [materiais, setMateriais] = useState([]);

  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroUrgencia, setFiltroUrgencia] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/solicitacoes/')
      .then(res => setSolicitacoes(res.data))
      .catch(err => console.error('Erro ao buscar solicitações:', err));

    axios.get('http://localhost:8000/api/materiais/')
      .then(res => setMateriais(res.data))
      .catch(err => console.error('Erro ao buscar materiais:', err));
  }, []);

  const statusLabels = {
    pendente: 'Pendente',
    em_separacao: 'Em Separação',
    em_transito: 'Em Trânsito',
    entregue: 'Entregue',
    cancelado: 'Cancelado'
  };

  const coresStatus = {
    pendente: '#f39c12',
    em_separacao: '#e67e22',
    em_transito: '#3498db',
    entregue: '#2ecc71',
    cancelado: '#e74c3c'
  };

  const filtrarSolicitacoes = () => {
    const agora = new Date();
    return solicitacoes.filter(s => {
      const data = new Date(s.data_criacao);
      const ultimoStatus = s.status?.[s.status.length - 1]?.status;

      if (filtroPeriodo === '7' && (agora - data) / (1000 * 60 * 60 * 24) > 7) return false;
      if (filtroPeriodo === '30' && (agora - data) / (1000 * 60 * 60 * 24) > 30) return false;
      if (filtroStatus && ultimoStatus !== filtroStatus) return false;
      if (filtroUrgencia && s.nivel_urgencia !== filtroUrgencia) return false;
      if (filtroUsuario && s.usuario_nome !== filtroUsuario) return false;

      return true;
    });
  };

  const dadosFiltrados = filtrarSolicitacoes();

  const contarPorStatus = () => {
    const contagem = {
      pendente: 0,
      em_separacao: 0,
      em_transito: 0,
      entregue: 0,
      cancelado: 0
    };

    dadosFiltrados.forEach(s => {
      const statusFinal = s.status?.[s.status.length - 1]?.status;
      if (statusFinal && contagem.hasOwnProperty(statusFinal)) {
        contagem[statusFinal]++;
      }
    });

    return contagem;
  };

  const contarPorUrgencia = () => {
    const contagem = { alta: 0, media: 0, baixa: 0 };
    dadosFiltrados.forEach(s => {
      if (contagem[s.nivel_urgencia] !== undefined) {
        contagem[s.nivel_urgencia]++;
      }
    });
    return contagem;
  };

  const dadosStatus = contarPorStatus();
  const dadosUrgencia = contarPorUrgencia();

  const dataBarra = {
    labels: Object.keys(dadosStatus).map(s => statusLabels[s]),
    datasets: [{
      label: 'Solicitações por Status',
      data: Object.values(dadosStatus),
      backgroundColor: Object.keys(dadosStatus).map(s => coresStatus[s]),
      borderRadius: 5
    }]
  };

  const dataRosca = {
    labels: Object.keys(dadosStatus).map(s => statusLabels[s]),
    datasets: [{
      label: 'Distribuição de Status',
      data: Object.values(dadosStatus),
      backgroundColor: Object.keys(dadosStatus).map(s => coresStatus[s]),
      borderWidth: 1
    }]
  };

  const dataLinha = {
    labels: Object.keys(dadosStatus).map(s => statusLabels[s]),
    datasets: [{
      label: 'Tendência de Solicitações',
      data: Object.values(dadosStatus),
      borderColor: '#3498db',
      backgroundColor: '#3498db',
      tension: 0.4
    }]
  };

  const topMenoresEstoque = [...materiais]
    .sort((a, b) => a.quantidade - b.quantidade)
    .slice(0, 5);

  const dataEstoque = {
    labels: topMenoresEstoque.map(m => m.nome),
    datasets: [{
      label: 'Estoque (Menores Quantidades)',
      data: topMenoresEstoque.map(m => m.quantidade),
      backgroundColor: '#e74c3c'
    }]
  };

  const dataUrgencia = {
    labels: ['Alta', 'Média', 'Baixa'],
    datasets: [{
      label: 'Solicitações por Urgência',
      data: [dadosUrgencia.alta, dadosUrgencia.media, dadosUrgencia.baixa],
      backgroundColor: ['#e74c3c', '#3498db', '#2ecc71']
    }]
  };

  const graficoStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  };

  const filtroStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '25px'
  };

  const selectStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    boxShadow: '1px 1px 4px rgba(0,0,0,0.05)',
    fontSize: '14px',
    minWidth: '180px',
    outline: 'none'
  };

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Filtros */}
      <div style={filtroStyle}>
        <select value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)} style={selectStyle}>
          <option value="">Filtrar por Período</option>
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="60">Últimos 60 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="todos">Todos</option>
        </select>

        <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={selectStyle}>
          <option value="">Filtrar por Status</option>
          {Object.keys(statusLabels).map(status => (
            <option key={status} value={status}>{statusLabels[status]}</option>
          ))}
        </select>

        <select value={filtroUrgencia} onChange={e => setFiltroUrgencia(e.target.value)} style={selectStyle}>
          <option value="">Filtrar por Urgência</option>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select>

        <select value={filtroUsuario} onChange={e => setFiltroUsuario(e.target.value)} style={selectStyle}>
          <option value="">Filtrar por Usuário</option>
          {[...new Set(solicitacoes.map(s => s.usuario_nome))].map((nome, i) => (
            <option key={i} value={nome}>{nome}</option>
          ))}
        </select>
      </div>

      {/* Gráficos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
        <div style={graficoStyle}>
          <h4 style={{ textAlign: 'center' }}>Solicitações por Status</h4>
          <Bar data={dataBarra} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div style={graficoStyle}>
            <h4 style={{ textAlign: 'center' }}>Solicitações por Urgência</h4>
            <div style={{ width: '250px', height: '250px', margin: '0 auto', position: 'relative' }}>
                <Pie
                data={dataUrgencia}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                    legend: { position: 'bottom' }
                    }
                }}
                />
            </div>
        </div>
       </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
      }}>
        <div style={graficoStyle}>
          <h4 style={{ textAlign: 'center' }}>Menores Estoques (Top 5)</h4>
          <Bar data={dataEstoque} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>

        <div style={graficoStyle}>
          <h4 style={{ textAlign: 'center' }}>Tendência de Solicitações</h4>
          <Line data={dataLinha} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
