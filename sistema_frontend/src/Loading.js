// src/Loading.js
import React from 'react';

function Loading() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      color: '#333'
    }}>
      <div className="spinner" style={{
        width: '60px',
        height: '60px',
        border: '8px solid #eee',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '20px'
      }}></div>
      Carregando...
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default Loading;
