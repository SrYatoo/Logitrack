import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    axios.get('http://127.0.0.1:8000/api/usuarios/')
      .then(response => {
        const usuarios = response.data;
        const usuarioEncontrado = usuarios.find(
          (u) => u.email === email && u.senha === senha
        );

        if (usuarioEncontrado) {
          onLoginSuccess(usuarioEncontrado);
        } else {
          setErro('E-mail ou senha incorretos.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar usuários:', error);
        setErro('Erro no servidor. Tente novamente mais tarde.');
      });
  };

  return (
    // 🔲 Container com imagem de fundo e sobreposição
    <div style={{
      minHeight: '100vh',
      backgroundImage: 'url("https://images.unsplash.com/photo-1581092334495-1b17a7fc9412?auto=format&fit=crop&w=1470&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    }}>
      {/* 🔲 Sobreposição escura para contraste */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 0
      }}></div>

      {/* 🔲 Formulário estilizado */}
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e3c72' }}>Login</h2>

        <form onSubmit={handleLogin}>
          {/* Campo de e-mail com ícone */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <FaEnvelope style={{
              position: 'absolute', top: '50%', left: '10px',
              transform: 'translateY(-50%)', color: '#1e3c72'
            }} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '89%',
                padding: '10px 10px 10px 35px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none',
                transition: '0.2s',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1e3c72'}
              onBlur={(e) => e.target.style.border = '1px solid #ccc'}
            />
          </div>

          {/* Campo de senha com ícone */}
          <div style={{ marginBottom: '20px', position: 'relative' }}>
            <FaLock style={{
              position: 'absolute', top: '50%', left: '10px',
              transform: 'translateY(-50%)', color: '#1e3c72'
            }} />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: '89%',
                padding: '10px 10px 10px 35px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                outline: 'none',
                transition: '0.2s',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1e3c72'}
              onBlur={(e) => e.target.style.border = '1px solid #ccc'}
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
              {erro}
            </div>
          )}

          {/* Botão de login */}
          <button type="submit" style={{
            width: '100%',
            backgroundColor: '#1e3c72',
            color: '#fff',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2a5298'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1e3c72'}
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
