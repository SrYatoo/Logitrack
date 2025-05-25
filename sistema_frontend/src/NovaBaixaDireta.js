import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NovaBaixaDireta() {
  const [materiais, setMateriais] = useState([]);
  const [materialSelecionado, setMaterialSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cargo, setCargo] = useState('');
  const [empresa, setEmpresa] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/materiais/')
      .then(response => setMateriais(response.data))
      .catch(error => console.error('Erro ao buscar materiais:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/baixas-diretas/', {
        material: materialSelecionado,
        quantidade: quantidade,
        nome_retirada: nome,
        cpf_retirada: cpf,
        cargo_retirada: cargo,
        empresa_retirada: empresa
      });
      alert('Baixa de material realizada com sucesso!');
      setMaterialSelecionado('');
      setQuantidade(1);
      setNome('');
      setCpf('');
      setCargo('');
      setEmpresa('');
    } catch (error) {
      console.error('Erro ao realizar baixa:', error);
      alert('Erro ao realizar baixa.');
    }
  };

  return (
    <div>
      <h2>Nova Baixa Direta de Material</h2>
      <form onSubmit={handleSubmit}>
        <select value={materialSelecionado} onChange={(e) => setMaterialSelecionado(e.target.value)} required>
          <option value="">Selecione o material</option>
          {materiais.map(mat => (
            <option key={mat.id} value={mat.id}>
              {mat.nome} ({mat.localizacao})
            </option>
          ))}
        </select><br />

        <input type="number" min="1" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} placeholder="Quantidade" required /><br />
        <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome de quem retira" required /><br />
        <input value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="CPF de quem retira" required /><br />
        <input value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Cargo" required /><br />
        <input value={empresa} onChange={(e) => setEmpresa(e.target.value)} placeholder="Empresa" required /><br />
        <button type="submit">Registrar Baixa</button>
      </form>
    </div>
  );
}

export default NovaBaixaDireta;
