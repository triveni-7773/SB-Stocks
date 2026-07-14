import React, { useState } from 'react';
import { tradingAPI } from '../services/api';

const StockCard = ({ stock, ownedQuantity = 0, onTradeSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [trading, setTrading] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', isError: false });

  const handleTrade = async (type) => {
    if (quantity <= 0) {
      setFeedback({ text: 'Quantity must be greater than 0', isError: true });
      return;
    }

    setTrading(true);
    setFeedback({ text: '', isError: false });

    try {
      let res;
      if (type === 'BUY') {
        res = await tradingAPI.buyStock({ symbol: stock.symbol, quantity });
      } else {
        res = await tradingAPI.sellStock({ symbol: stock.symbol, quantity });
      }

      setFeedback({
        text: type === 'BUY' ? `Successfully bought ${quantity} shares!` : `Successfully sold ${quantity} shares!`,
        isError: false
      });

      // Clear feedback after 3 seconds
      setTimeout(() => setFeedback({ text: '', isError: false }), 3000);
      
      if (onTradeSuccess) {
        onTradeSuccess();
      }
    } catch (err) {
      setFeedback({
        text: err.response?.data?.message || `${type === 'BUY' ? 'Buy' : 'Sell'} trade failed`,
        isError: true
      });
    } finally {
      setTrading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      padding: '20px',
      margin: '15px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      width: '280px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', color: '#1a237e', fontSize: '20px', fontWeight: 'bold' }}>
            {stock.symbol}
          </h3>
          <span style={{ fontSize: '12px', color: '#777', display: 'block', marginBottom: '8px' }}>
            {stock.name}
          </span>
        </div>
        <span style={{
          fontSize: '22px',
          fontWeight: 'bold',
          color: '#2e7d32'
        }}>
          ${stock.currentPrice?.toFixed(2)}
        </span>
      </div>

      {ownedQuantity > 0 && (
        <div style={{
          backgroundColor: '#e8eaf6',
          color: '#3f51b5',
          fontSize: '13px',
          padding: '6px 12px',
          borderRadius: '6px',
          fontWeight: 'bold',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          💼 You own: {ownedQuantity} shares
        </div>
      )}

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', gap: '10px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>Quantity:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
            style={{
              width: '80px',
              padding: '6px 8px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              fontSize: '14px',
              textAlign: 'center'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleTrade('BUY')}
            disabled={trading}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              opacity: trading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!trading) e.target.style.backgroundColor = '#43a047'; }}
            onMouseLeave={(e) => { if (!trading) e.target.style.backgroundColor = '#4caf50'; }}
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade('SELL')}
            disabled={trading || ownedQuantity <= 0}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: ownedQuantity > 0 ? '#f44336' : '#e0e0e0',
              color: ownedQuantity > 0 ? 'white' : '#9e9e9e',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: ownedQuantity > 0 ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              opacity: trading ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!trading && ownedQuantity > 0) e.target.style.backgroundColor = '#d32f2f'; }}
            onMouseLeave={(e) => { if (!trading && ownedQuantity > 0) e.target.style.backgroundColor = '#f44336'; }}
          >
            Sell
          </button>
        </div>

        {feedback.text && (
          <div style={{
            marginTop: '12px',
            padding: '8px',
            borderRadius: '6px',
            fontSize: '13px',
            textAlign: 'center',
            backgroundColor: feedback.isError ? '#ffebee' : '#e8f5e9',
            color: feedback.isError ? '#c62828' : '#2e7d32',
            fontWeight: '500',
            border: `1px solid ${feedback.isError ? '#ffcdd2' : '#c8e6c9'}`
          }}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockCard;