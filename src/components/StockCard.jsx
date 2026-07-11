import React from 'react';

const StockCard = ({ stock }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '10px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'inline-block',
      minWidth: '200px'
    }}>
      <h3 style={{ color: '#1a237e' }}>{stock.symbol}</h3>
      <p style={{ fontSize: '14px', color: '#666' }}>{stock.name}</p>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
        ${stock.currentPrice?.toFixed(2)}
      </p>
    </div>
  );
};

export default StockCard;