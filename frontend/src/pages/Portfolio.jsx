import React, { useState, useEffect } from 'react';
import { portfolioAPI } from '../services/api';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await portfolioAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading portfolio...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1a237e' }}>My Portfolio</h1>

      {portfolio.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          You don't own any stocks yet. Start trading!
        </p>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Buy Price</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Current Price</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Total Value</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((item, index) => {
                const profitLoss = (item.currentPrice - item.buyPrice) * item.quantity;
                const isPositive = profitLoss >= 0;
                return (
                  <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.symbol}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${item.buyPrice?.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${item.currentPrice?.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${(item.quantity * item.currentPrice)?.toFixed(2)}</td>
                    <td style={{
                      padding: '12px',
                      textAlign: 'right',
                      color: isPositive ? '#4caf50' : '#f44336'
                    }}>
                      ${profitLoss?.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Portfolio;