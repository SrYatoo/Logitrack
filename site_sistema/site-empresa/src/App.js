import React, { useState } from 'react'; // ✅ Importa o hook
import './App.css';
import { FaTruck, FaWarehouse, FaChartBar } from 'react-icons/fa';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';


function App() {
  const [mostrarModal, setMostrarModal] = useState(false);
  return (
    <div className="homepage">
      <header className="navbar">
        <div className="logo">LogiTrack</div>
        <nav className="menu">
          <a href="#servicos">Serviços</a>
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
        </nav>
      </header>
      
      {mostrarModal && (
        <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="modal-demo" onClick={(e) => e.stopPropagation()}>
            <h3>Solicitar Demonstração</h3>
            <form className="form-demo" onSubmit={(e) => {
              e.preventDefault();
              alert('Solicitação enviada!'); // substituir futuramente por integração real
              setMostrarModal(false);
            }}>
              <input type="text" placeholder="Nome da Empresa" required />
              <input type="text" placeholder="Seu nome completo" required />
              <input type="email" placeholder="E-mail" required />
              <input type="tel" placeholder="Telefone de contato" required />
              <textarea placeholder="Fale um pouco da sua necessidade..." rows="4" required />
              <button type="submit">Enviar</button>
            </form>
            <button className="close-btn" onClick={() => setMostrarModal(false)}>×</button>
          </div>
        </div>
      )}


      <main className="hero-section">
        <div className="hero-text">
          <h1>Gerencie sua Logística com Eficiência</h1>
          <p>Otimize o envio, estoque e controle de materiais com o sistema LogiTrack.</p>
          <button onClick={() => setMostrarModal(true)} className="btn-demo">Solicitar Demonstração</button>
        </div>

        <div className="hero-img">
          <img src="/operacao_logistica.png" alt="Logística"  />
        </div>
      </main>

      <section id="servicos" className="servicos">
        <h2>Principais Funcionalidades</h2>
        <div className="cards">
          <div className="card">
            <FaTruck className="icon" />
            <h3>Gestão de Entregas</h3>
            <p>Acompanhe solicitações e status em tempo real.</p>
          </div>
          <div className="card">
            <FaWarehouse className="icon" />
            <h3>Controle de Estoque</h3>
            <p>Visualize materiais, quantidades e localizações.</p>
          </div>
          <div className="card">
            <FaChartBar className="icon" />
            <h3>Dashboard de Indicadores</h3>
            <p>Tome decisões com base em dados claros.</p>
          </div>
        </div>
      </section>

      <section id="sobre" className="section sobre">
        <h2>Sobre a LogiTrack</h2>
        <p>
          A <strong>LogiTrack</strong> surgiu da necessidade real de melhorar a comunicação nos processos logísticos. Sabemos que atrasos, falhas de entrega e a falta de rastreabilidade podem comprometer operações importantes. Pensando nisso, desenvolvemos uma plataforma que organiza o fluxo de informações entre os setores logísticos, promovendo agilidade, clareza e controle total sobre os envios de materiais.
        </p>

        <div className="info-boxes">
          <div className="box">
            <h3>Missão</h3>
            <p>Promover o controle e a rastreabilidade de materiais através de uma solução digital intuitiva e eficaz.</p>
          </div>
          <div className="box">
            <h3>Visão</h3>
            <p>Ser referência em soluções tecnológicas para comunicação logística, reduzindo erros e otimizando operações.</p>
          </div>
          <div className="box">
            <h3>Valores</h3>
            <ul>
              <li>Transparência</li>
              <li>Eficiência</li>
              <li>Inovação</li>
              <li>Comprometimento</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contato" className="section contato">
        <h2>Entre em Contato</h2>
        <p>Fale com a equipe LogiTrack. Estamos prontos para responder suas dúvidas e ajudar no que for preciso.</p>

        <div className="contato-container">
          <div className="contato-info">
            <p><FaMapMarkerAlt /> Americana/SP, Brasil</p>
            <p><FaEnvelope /> contato@logitrack.com</p>
            <p><FaPhone /> (19) 99999-9999</p>
          </div>

          <form className="form-contato" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Seu nome" required />
            <input type="email" placeholder="Seu e-mail" required />
            <textarea placeholder="Sua mensagem" rows="5" required />
            <button type="submit">Enviar</button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2025 LogiTrack. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;
