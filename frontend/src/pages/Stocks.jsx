import React, { useState, useEffect } from 'react';
import { stockAPI } from '../services/api';
import StockCard from '../components/StockCard';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getAllStocks();
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading stocks...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1a237e' }}>📊 Stock Market</h1>
      <p>View and trade stocks</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
        {stocks.map(stock => (
          <StockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      {stocks.length === 0 && (
        <p style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No stocks available
        </p>
      )}
    </div>
  );
};

export default Stocks;