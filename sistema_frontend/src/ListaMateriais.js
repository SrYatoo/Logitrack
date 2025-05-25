import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ListaMateriais() {
  const [materiais, setMateriais] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({});

  useEffect(() => {
    carregarMateriais();
  }, []);

  const carregarMateriais = () => {
    axios.get('http://127.0.0.1:8000/api/materiais/')
      .then(response => {
        setMateriais(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar materiais:', error);
      });
  };

  const excluirMaterial = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este material?')) {
      axios.delete(`http://127.0.0.1:8000/api/materiais/${id}/`)
        .then(response => {
          alert('Material excluído com sucesso!');
          carregarMateriais();
        })
        .catch(error => {
          console.error('Erro ao excluir material:', error);
          alert('Erro ao excluir material.');
        });
    }
  };

  const iniciarEdicao = (material) => {
    setEditandoId(material.id);
    setFormEdicao(material);
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setFormEdicao({});
  };

  const salvarEdicao = () => {
    axios.put(`http://127.0.0.1:8000/api/materiais/${editandoId}/`, formEdicao)
      .then(response => {
        alert('Material atualizado com sucesso!');
        carregarMateriais();
        cancelarEdicao();
      })
      .catch(error => {
        console.error('Erro ao atualizar material:', error);
        alert('Erro ao atualizar material.');
      });
  };

  const handleChange = (e) => {
    setFormEdicao({ ...formEdicao, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Materiais Cadastrados</h2>
      {materiais.length === 0 ? (
        <p>Não há materiais cadastrados ainda.</p>
      ) : (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Cor</th>
              <th>Gênero</th>
              <th>Tamanho</th>
              <th>Quantidade</th>
              <th>Localização</th>
              <th>Observação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {materiais.map((material) => (
              <tr key={material.id}>
                {editandoId === material.id ? (
                  <>
                    <td><input name="nome" value={formEdicao.nome} onChange={handleChange} /></td>
                    <td><input name="categoria" value={formEdicao.categoria} onChange={handleChange} /></td>
                    <td><input name="cor" value={formEdicao.cor} onChange={handleChange} /></td>
                    <td><input name="genero" value={formEdicao.genero} onChange={handleChange} /></td>
                    <td><input name="tamanho" value={formEdicao.tamanho} onChange={handleChange} /></td>
                    <td><input type="number" name="quantidade" value={formEdicao.quantidade} onChange={handleChange} /></td>
                    <td><input name="localizacao" value={formEdicao.localizacao} onChange={handleChange} /></td>
                    <td><input name="observacao" value={formEdicao.observacao} onChange={handleChange} /></td>
                    <td>
                      <button onClick={salvarEdicao}>Salvar</button>
                      <button onClick={cancelarEdicao} style={{ marginLeft: '5px' }}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{material.nome}</td>
                    <td>{material.categoria}</td>
                    <td>{material.cor}</td>
                    <td>{material.genero}</td>
                    <td>{material.tamanho}</td>
                    <td>{material.quantidade}</td>
                    <td>{material.localizacao}</td>
                    <td>{material.observacao}</td>
                    <td>
                      <button onClick={() => iniciarEdicao(material)}>Editar</button>
                      <button onClick={() => excluirMaterial(material.id)} style={{ marginLeft: '5px' }}>Excluir</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaMateriais;
