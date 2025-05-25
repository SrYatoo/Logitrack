import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NovaTransferencia() {
  const [materiais, setMateriais] = useState([]);
  const [materialSelecionado, setMaterialSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/materiais/')
      .then(response => setMateriais(response.data))
      .catch(error => console.error('Erro ao buscar materiais:', error));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/transferencias/', {
        material: materialSelecionado,
        quantidade: quantidade,
        origem: origem,
        destino: destino
      });
      alert('Transferência registrada com sucesso!');
      setMaterialSelecionado('');
      setQuantidade(1);
      setOrigem('');
      setDestino('');
    } catch (error) {
      console.error('Erro ao registrar transferência:', error);
      alert('Erro ao registrar transferência.');
    }
  };

  return (
    <div>
      <h2>Nova Transferência de Material</h2>
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
        <input value={origem} onChange={(e) => setOrigem(e.target.value)} placeholder="Origem" required /><br />
        <input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Destino" required /><br />
        <button type="submit">Registrar Transferência</button>
      </form>
    </div>
  );
}

export default NovaTransferencia;
