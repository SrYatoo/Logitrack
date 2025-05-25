import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NovoEndereco({ onEnderecoCriado }) {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cep, setCep] = useState('');
  const [regiao, setRegiao] = useState('');
  const [enderecos, setEnderecos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = () => {
    axios.get('http://127.0.0.1:8000/api/enderecos/')
      .then(res => setEnderecos(res.data))
      .catch(err => console.error('Erro ao buscar unidades:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nomeDuplicado = enderecos.some(e => e.nome.trim().toLowerCase() === nome.trim().toLowerCase() && e.id !== editandoId);
    if (nomeDuplicado) {
      alert('Já existe uma unidade com esse nome.');
      return;
    }

    const payload = { nome, endereco, bairro, cidade, uf, cep, regiao };

    try {
      if (editandoId) {
        await axios.put(`http://127.0.0.1:8000/api/enderecos/${editandoId}/`, payload);
        alert('Unidade atualizada com sucesso!');
        setEditandoId(null);
      } else {
        await axios.post('http://127.0.0.1:8000/api/enderecos/', payload);
        alert('Unidade cadastrada com sucesso!');
      }

      setNome('');
      setEndereco('');
      setBairro('');
      setCidade('');
      setUf('');
      setCep('');
      setRegiao('');

      carregarEnderecos();
      if (onEnderecoCriado) onEnderecoCriado();

    } catch (error) {
      console.error('Erro ao salvar unidade:', error);
      alert('Erro ao salvar unidade.');
    }
  };

  const editar = (unidade) => {
    setEditandoId(unidade.id);
    setNome(unidade.nome);
    setEndereco(unidade.endereco);
    setBairro(unidade.bairro);
    setCidade(unidade.cidade);
    setUf(unidade.uf);
    setCep(unidade.cep);
    setRegiao(unidade.regiao);
  };

  const excluir = async (id) => {
    try {
      const todosMateriais = await axios.get(`http://127.0.0.1:8000/api/materiais/`);
      const materiaisDaUnidade = todosMateriais.data.filter(m => m.localizacao === id);
      if (materiaisDaUnidade.length > 0) {
        alert('Não é possível excluir: existem materiais nessa unidade.');
        return;
      }

      const solicitacoes = await axios.get(`http://127.0.0.1:8000/api/solicitacoes/`);
      const bloqueada = solicitacoes.data.some(s =>
        (s.remetente === id || s.destinatario === id) &&
        ['pendente', 'em_separacao', 'em_transito'].includes(s.status.at(-1)?.status)
      );

      if (bloqueada) {
        alert('Não é possível excluir: existem solicitações em andamento com essa unidade.');
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/enderecos/${id}/`);
      alert('Unidade excluída com sucesso!');
      carregarEnderecos();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      alert('Erro ao excluir unidade.');
    }
  };
  const inputStyle = {
    flex: '1 1 250px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    maxWidth: '300px'
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Cadastro de Unidade</h2>
      <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          marginBottom: '30px',
          backgroundColor: '#f5f5f5',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.1)'
        }}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome da Unidade"
            required
            style={inputStyle}
          />
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            placeholder="Endereço"
            required
            style={inputStyle}
          />
          <input
            type="text"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            placeholder="Bairro"
            required
            style={inputStyle}
          />
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            placeholder="Cidade"
            required
            style={inputStyle}
          />
          <input
            type="text"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            placeholder="UF"
            maxLength="2"
            required
            style={inputStyle}
          />
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="CEP"
            required
            style={inputStyle}
          />
          <select
            value={regiao}
            onChange={(e) => setRegiao(e.target.value)}
            required
            style={{ ...inputStyle, padding: '10px' }}
          >
            <option value="">Selecione a Região</option>
            <option value="Norte">Norte</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
          </select>

          <button
            type="submit"
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {editandoId ? 'Atualizar Unidade' : 'Cadastrar Unidade'}
          </button>
        </form>


      {/* Lista de unidades */}
      <hr />
      <h3 style={{ marginTop: '30px' }}>Unidades Cadastradas</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
        {enderecos.map((e) => (
          <div key={e.id} style={{
            border: '1px solid #ccc',
            borderRadius: '10px',
            padding: '20px',
            width: '280px',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
            position: 'relative'
          }}>
            <h4 style={{ marginBottom: '10px' }}>{e.nome}</h4>
            <p style={{ margin: '4px 0' }}><strong>Endereço:</strong> {e.endereco}</p>
            <p style={{ margin: '4px 0' }}><strong>Bairro:</strong> {e.bairro}</p>
            <p style={{ margin: '4px 0' }}><strong>Cidade:</strong> {e.cidade}/{e.uf}</p>
            <p style={{ margin: '4px 0' }}><strong>CEP:</strong> {e.cep}</p>
            <p style={{ margin: '4px 0' }}><strong>Região:</strong> {e.regiao}</p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
              <button
                onClick={() => editar(e)}
                style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Editar
              </button>
              <button
                onClick={() => excluir(e.id)}
                style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NovoEndereco;
