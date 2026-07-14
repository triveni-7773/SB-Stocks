import React, { useState, useEffect } from 'react';
import { stockAPI, portfolioAPI } from '../services/api';
import StockCard from '../components/Stockcard'; // note lowercase c in filename from list_dir

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [stocksRes, portfolioRes, balanceRes] = await Promise.all([
        stockAPI.getAllStocks(),
        portfolioAPI.getPortfolio(),
        portfolioAPI.getBalance()
      ]);
      setStocks(stocksRes.data);
      setPortfolio(portfolioRes.data);
      setBalance(balanceRes.data.balance);
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getOwnedQuantity = (symbol) => {
    const item = portfolio.find(p => p.symbol === symbol.toUpperCase());
    return item ? item.quantity : 0;
  };

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontSize: '18px', color: '#666' }}>
        Loading market data...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#1a237e', margin: '0 0 5px 0' }}>📊 Stock Market</h1>
          <p style={{ margin: '0', color: '#666' }}>Explore, buy, and sell available stocks</p>
        </div>

        <div style={{
          backgroundColor: '#e8eaf6',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ color: '#5c6bc0', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase' }}>Buying Power:</span>
          <span style={{ color: '#1a237e', fontWeight: 'bold', fontSize: '20px' }}>
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: '10px -15px',
        justifyContent: 'flex-start'
      }}>
        {stocks.map(stock => (
          <StockCard
            key={stock.symbol}
            stock={stock}
            ownedQuantity={getOwnedQuantity(stock.symbol)}
            onTradeSuccess={fetchData}
          />
        ))}
      </div>

      {stocks.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#666',
          marginTop: '20px'
        }}>
          No stocks available in the market.
        </div>
      )}
    </div>
  );
};

export default Stocks;