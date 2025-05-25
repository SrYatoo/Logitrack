import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NovaSolicitacao.css';


function NovaSolicitacao({ onSolicitacaoCriada, usuarioLogado }) {
  const [enderecos, setEnderecos] = useState([]);
  const [materiais, setMateriais] = useState([]);

  const [remetenteSelecionado, setRemetenteSelecionado] = useState('');
  const [destinatarioSelecionado, setDestinatarioSelecionado] = useState('');

  const [remetenteManual, setRemetenteManual] = useState({
    nome: '', endereco: '', bairro: '', cidade: '', uf: '', cep: '', regiao: '',
  });

  const [destinatarioManual, setDestinatarioManual] = useState({
    nome: '', endereco: '', bairro: '', cidade: '', uf: '', cep: '', regiao: '',
  });

  const [salvarRemetente, setSalvarRemetente] = useState(false);
  const [salvarDestinatario, setSalvarDestinatario] = useState(false);

  const [descricaoMaterial, setDescricaoMaterial] = useState('');
  const [nivelUrgencia, setNivelUrgencia] = useState('media');
  const [observacao, setObservacao] = useState('');

  const [materialSelecionado, setMaterialSelecionado] = useState('');
  const [quantidadeMaterial, setQuantidadeMaterial] = useState(1);
  const [itensSolicitados, setItensSolicitados] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/enderecos/')
      .then(response => setEnderecos(response.data))
      .catch(error => console.error('Erro ao buscar endereços:', error));

    axios.get('http://127.0.0.1:8000/api/materiais/')
      .then(response => setMateriais(response.data))
      .catch(error => console.error('Erro ao buscar materiais:', error));
  }, []);

  const preencherCampos = (id, tipo) => {
    const endereco = enderecos.find(e => e.id === parseInt(id));
    if (endereco) {
      if (tipo === 'remetente') setRemetenteManual(endereco);
      else setDestinatarioManual(endereco);
    }
  };

  const adicionarItem = () => {
    if (materialSelecionado && quantidadeMaterial > 0) {
      const material = materiais.find(m => m.id === parseInt(materialSelecionado));
      if (!material) return;
  
      const jaExiste = itensSolicitados.some(item => item.material === material.id);
      if (jaExiste) {
        alert(`O material "${material.nome}" já foi adicionado.`);
        return;
      }
  
      setItensSolicitados(prev => [...prev, {
        material: material.id,
        nome: material.nome,
        quantidade: quantidadeMaterial
      }]);
  
      setMaterialSelecionado('');
      setQuantidadeMaterial(1);
    }
  };
  

  const removerItem = (index) => {
    setItensSolicitados(prev => prev.filter((_, i) => i !== index));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let remetenteId = remetenteSelecionado;
  let destinatarioId = destinatarioSelecionado;

  try {
    if (!remetenteSelecionado && salvarRemetente) {
      const res = await axios.post('http://127.0.0.1:8000/api/enderecos/', remetenteManual);
      remetenteId = res.data.id;
    }

    if (!destinatarioSelecionado && salvarDestinatario) {
      const res = await axios.post('http://127.0.0.1:8000/api/enderecos/', destinatarioManual);
      destinatarioId = res.data.id;
    }

    if (!remetenteId || !destinatarioId) {
      alert('Remetente e Destinatário precisam ser selecionados ou cadastrados.');
      return;
    }

    if (remetenteId === destinatarioId) {
      alert('Remetente e destinatário não podem ser iguais.');
      return;
    }

    const solicitacaoRes = await axios.post('http://127.0.0.1:8000/api/solicitacoes/', {
      usuario: usuarioLogado.id,
      remetente: remetenteId,
      destinatario: destinatarioId,
      destino: destinatarioManual.cidade || '',
      nivel_urgencia: nivelUrgencia,
      observacao: observacao,
    });

    const solicitacaoId = solicitacaoRes.data.id;

    // ✅ Adiciona status "pendente"
    await axios.post('http://127.0.0.1:8000/api/status/', {
      solicitacao: solicitacaoId,
      status: 'pendente',
      comentario: 'Solicitação criada automaticamente com status pendente.'
    });

    for (const item of itensSolicitados) {
      const material = materiais.find(m => m.id === item.material);
      if (!material) continue;

      if (item.quantidade > material.quantidade) {
        alert(`Erro: estoque insuficiente para "${material.nome}".`);
        return;
      }

      // 1️⃣ Cria o item da solicitação
      await axios.post('http://127.0.0.1:8000/api/itens-solicitacao/', {
        solicitacao: solicitacaoId,
        material: item.material,
        quantidade: item.quantidade,
      });

      // 2️⃣ Atualiza o estoque com baixa automática
      const novaQtd = material.quantidade - item.quantidade;
      await axios.patch(`http://127.0.0.1:8000/api/materiais/${material.id}/`, {
        quantidade: novaQtd
      });

      // 3️⃣ Alerta se estoque estiver abaixo de 5 unidades
      if (novaQtd <= 5) {
        alert(`⚠ Atenção: o material "${material.nome}" está com estoque crítico (${novaQtd} unidades).`);
      }
    }

    alert(`Solicitação #${solicitacaoId} criada com sucesso e estoque atualizado ✅`);
    if (onSolicitacaoCriada) onSolicitacaoCriada();

  } catch (error) {
    console.error('Erro ao criar solicitação:', error);
    alert('Erro ao criar solicitação.');
  }
};


  return (
    <div className="form-container">  
      <h2>Nova Solicitação de Envio</h2>
      <form onSubmit={handleSubmit}>
        
        {/* --- Remetente --- */}
        <h3>Selecionar Remetente</h3>
        <select value={remetenteSelecionado} onChange={(e) => {
          setRemetenteSelecionado(e.target.value);
          preencherCampos(e.target.value, 'remetente');
        }}>
          <option value="">-- Novo endereço manual --</option>
          {enderecos.map(endereco => (
            <option key={endereco.id} value={endereco.id}>
              {endereco.nome} - {endereco.cidade}/{endereco.uf}
            </option>
          ))}
        </select>

        {/* Formulário manual Remetente */}
        <div>
          <input placeholder="Nome" value={remetenteManual.nome} onChange={(e) => setRemetenteManual({...remetenteManual, nome: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <input placeholder="Endereço" value={remetenteManual.endereco} onChange={(e) => setRemetenteManual({...remetenteManual, endereco: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <input placeholder="Bairro" value={remetenteManual.bairro} onChange={(e) => setRemetenteManual({...remetenteManual, bairro: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <input placeholder="Cidade" value={remetenteManual.cidade} onChange={(e) => setRemetenteManual({...remetenteManual, cidade: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <input placeholder="UF" value={remetenteManual.uf} onChange={(e) => setRemetenteManual({...remetenteManual, uf: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <input placeholder="CEP" value={remetenteManual.cep} onChange={(e) => setRemetenteManual({...remetenteManual, cep: e.target.value})} readOnly={!!remetenteSelecionado} /><br />
          <select value={remetenteManual.regiao} onChange={(e) => setRemetenteManual({...remetenteManual, regiao: e.target.value})} disabled={!!remetenteSelecionado}>
            <option value="">Selecione a Região</option>
            <option value="Norte">Norte</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
          </select>
        </div>
        {!remetenteSelecionado && (
          <div className="checkbox-inline">
            <input
              type="checkbox"
              id="salvarRemetente"
              checked={salvarRemetente}
              onChange={(e) => setSalvarRemetente(e.target.checked)}
            />
            <label htmlFor="salvarRemetente">Salvar Remetente</label>
          </div>  
        )}

        <hr />

        {/* --- Destinatário --- */}
        <h3>Selecionar Destinatário</h3>
        <select value={destinatarioSelecionado} onChange={(e) => {
          setDestinatarioSelecionado(e.target.value);
          preencherCampos(e.target.value, 'destinatario');
        }}>
          <option value="">-- Novo endereço manual --</option>
          {enderecos.map(endereco => (
            <option key={endereco.id} value={endereco.id}>
              {endereco.nome} - {endereco.cidade}/{endereco.uf}
            </option>
          ))}
        </select>

        {/* Formulário manual Destinatário */}
        <div>
          <input placeholder="Nome" value={destinatarioManual.nome} onChange={(e) => setDestinatarioManual({...destinatarioManual, nome: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <input placeholder="Endereço" value={destinatarioManual.endereco} onChange={(e) => setDestinatarioManual({...destinatarioManual, endereco: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <input placeholder="Bairro" value={destinatarioManual.bairro} onChange={(e) => setDestinatarioManual({...destinatarioManual, bairro: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <input placeholder="Cidade" value={destinatarioManual.cidade} onChange={(e) => setDestinatarioManual({...destinatarioManual, cidade: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <input placeholder="UF" value={destinatarioManual.uf} onChange={(e) => setDestinatarioManual({...destinatarioManual, uf: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <input placeholder="CEP" value={destinatarioManual.cep} onChange={(e) => setDestinatarioManual({...destinatarioManual, cep: e.target.value})} readOnly={!!destinatarioSelecionado} /><br />
          <select value={destinatarioManual.regiao} onChange={(e) => setDestinatarioManual({...destinatarioManual, regiao: e.target.value})} disabled={!!destinatarioSelecionado}>
            <option value="">Selecione a Região</option>
            <option value="Norte">Norte</option>
            <option value="Nordeste">Nordeste</option>
            <option value="Centro-Oeste">Centro-Oeste</option>
            <option value="Sudeste">Sudeste</option>
            <option value="Sul">Sul</option>
          </select>
        </div>
        {!destinatarioSelecionado && (
          <div className="checkbox-inline">
            <input
              type="checkbox"
              id="salvarDestinatario"
              checked={salvarDestinatario}
              onChange={(e) => setSalvarDestinatario(e.target.checked)}
            />
            <label htmlFor="salvarDestinatario">Salvar Destinatário</label>
          </div>
        )}



        <hr />

        {/* --- Informações da Solicitação --- */}

        <label>Nível de Urgência:</label><br />
        <select value={nivelUrgencia} onChange={(e) => setNivelUrgencia(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Média</option>
          <option value="baixa">Baixa</option>
        </select><br />
        
        <label>Observação</label><br />
        <textarea placeholder="Observações (opcional)" value={observacao} onChange={(e) => setObservacao(e.target.value)} /><br />

        {/* --- Materiais --- */}
        <h3>Materiais:</h3>
        <select value={materialSelecionado} onChange={(e) => setMaterialSelecionado(e.target.value)}>
          <option value="">Selecione um material</option>
          {materiais
            .filter(material => material.localizacao === remetenteManual.nome)
            .map(material => (
              <option key={material.id} value={material.id}>
                {material.nome} ({material.cor || ''}) - {material.quantidade} unid.
              </option>
            ))}
        </select>


        <input type="number" min="1" value={quantidadeMaterial} onChange={(e) => setQuantidadeMaterial(Number(e.target.value))} style={{ width: '60px', marginLeft: '5px' }} />
        <button type="button" onClick={adicionarItem}className="button-margin-left">Adicionar Material</button>

        <ul>
          {itensSolicitados.map((item, index) => (
            <li key={index}>
              {item.nome} - {item.quantidade} unid.
              <button type="button" onClick={() => removerItem(index)} style={{ marginLeft: '10px' }}>Remover</button>
            </li>
          ))}
        </ul>

        <hr />
        <button type="submit" disabled={itensSolicitados.length === 0}>
          Criar Solicitação
        </button>


      </form>
    </div>
  );
}

export default NovaSolicitacao;
