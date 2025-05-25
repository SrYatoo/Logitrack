import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NovoMaterial() {
  const [material, setMaterial] = useState({
    nome: '', categoria: '', cor: '', genero: '',
    tamanho: '', quantidade: '', localizacao: '', observacao: ''
  });

  const [materiais, setMateriais] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [materialEditado, setMaterialEditado] = useState({});

  useEffect(() => {
    buscarMateriais();
    buscarEnderecos();
  }, []);

  const buscarMateriais = () => {
    axios.get('http://127.0.0.1:8000/api/materiais/')
      .then(res => setMateriais(res.data));
  };

  const buscarEnderecos = () => {
    axios.get('http://127.0.0.1:8000/api/enderecos/')
      .then(res => setEnderecos(res.data));
  };

  const handleChange = (e) => {
    setMaterial({ ...material, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const duplicado = materiais.some(m =>
      m.nome.toLowerCase() === material.nome.toLowerCase() &&
      m.localizacao === material.localizacao
    );

    if (duplicado) {
      alert('Já existe esse material nessa localização!');
      return;
    }

    axios.post('http://127.0.0.1:8000/api/materiais/', material)
      .then(() => {
        alert('Material cadastrado!');
        setMaterial({
          nome: '', categoria: '', cor: '', genero: '',
          tamanho: '', quantidade: '', localizacao: '', observacao: ''
        });
        buscarMateriais();
      });
  };

  const iniciarEdicao = (m) => {
    setEditandoId(m.id);
    setMaterialEditado({ ...m });
  };

  const salvarEdicao = (id) => {
    axios.put(`http://127.0.0.1:8000/api/materiais/${id}/`, materialEditado)
      .then(() => {
        setEditandoId(null);
        buscarMateriais();
      });
  };

  const excluirMaterial = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      axios.delete(`http://127.0.0.1:8000/api/materiais/${id}/`)
        .then(() => buscarMateriais());
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '30px'}}>
      <h2 style={{ marginBottom: '20px' }}>Cadastrar Novo Material</h2>

      <form onSubmit={handleSubmit} style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Nome</label>  
          <input name="nome" value={material.nome} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} required />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Categoria</label>
          <input name="categoria" value={material.categoria} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} required />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Cor</label>
          <input name="cor" value={material.cor} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Gênero</label>
          <input name="genero" value={material.genero} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Tamanho</label>
          <input name="tamanho" value={material.tamanho} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Quantidade</label>
          <input type="number" name="quantidade" value={material.quantidade} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} required />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Localização</label>
          <select name="localizacao" value={material.localizacao} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} required>
            <option value="">Localização</option>
            {enderecos.map(e => <option key={e.id} value={e.nome}>{e.nome}</option>)}
          </select>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label>Observação</label>
          <input name="observacao" value={material.observacao} onChange={handleChange} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
        </div>
        
        <div style={{ gridColumn: '1 / -1', textAlign: 'right' }}>
          <button type="submit" style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background 0.3s'
          }}>
            Cadastrar
          </button>
        </div>  
      </form>

      <h3>Materiais Cadastrados</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {materiais.map((m) => (
          <div key={m.id} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#f9f9f9',
            boxShadow: '2px 2px 6px rgba(0,0,0,0.1)'
          }}>
            {editandoId === m.id ? (
              <>
                <label>Nome:  </label>
                <input style={{ width: '100%' }} value={materialEditado.nome} onChange={(e) => setMaterialEditado({ ...materialEditado, nome: e.target.value })} />
                <label>Categoria:  </label>
                <input style={{ width: '100%' }} value={materialEditado.categoria} onChange={(e) => setMaterialEditado({ ...materialEditado, categoria: e.target.value })} />
                <label>Cor:  </label>
                <input style={{ width: '100%' }} value={materialEditado.cor} onChange={(e) => setMaterialEditado({ ...materialEditado, cor: e.target.value })} />
                <label>Genero:  </label>
                <input style={{ width: '100%' }} value={materialEditado.genero} onChange={(e) => setMaterialEditado({ ...materialEditado, genero: e.target.value })} />
                <label>Tamanho:  </label>
                <input style={{ width: '100%' }} value={materialEditado.tamanho} onChange={(e) => setMaterialEditado({ ...materialEditado, tamanho: e.target.value })} />
                <label>Quantidade:  </label>
                <input style={{ width: '100%' }} type="number" value={materialEditado.quantidade} onChange={(e) => setMaterialEditado({ ...materialEditado, quantidade: e.target.value })} />
                <label>Região:  </label>
                <select style={{ width: '100%' }} value={materialEditado.localizacao} onChange={(e) => setMaterialEditado({ ...materialEditado, localizacao: e.target.value })}>
                  <option value="">Localização</option>
                  {enderecos.map(e => <option key={e.id} value={e.nome}>{e.nome}</option>)}
                </select>
                <label>Observação:  </label>
                <input style={{ width: '100%' }} value={materialEditado.observacao} onChange={(e) => setMaterialEditado({ ...materialEditado, observacao: e.target.value })} />
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => salvarEdicao(m.id)} style={{ background: '#1976d2', color: '#fff', marginRight: '5px', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salvar</button>
                  <button onClick={() => setEditandoId(null)} style={{ background: '#888', color: '#fff', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h4>{m.nome}</h4>
                <p><strong>Categoria:</strong> {m.categoria}</p>
                <p><strong>Cor:</strong> {m.cor || '—'}</p>
                <p><strong>Gênero:</strong> {m.genero || '—'}</p>
                <p><strong>Tamanho:</strong> {m.tamanho || '—'}</p>
                <p><strong>Qtd:</strong> {m.quantidade}</p>
                <p><strong>Local:</strong> {m.localizacao}</p>
                <p><strong>Obs:</strong> {m.observacao || '—'}</p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', gap: '10px' }}>
                  <button onClick={() => iniciarEdicao(m)} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                  <button onClick={() => excluirMaterial(m.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Excluir</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NovoMaterial;
