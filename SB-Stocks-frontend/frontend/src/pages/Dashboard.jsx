import React, { useState, useEffect } from 'react';
import { portfolioAPI, transactionAPI } from '../services/api';

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [balanceRes, transRes] = await Promise.all([
          portfolioAPI.getBalance(),
          transactionAPI.getTransactions()
        ]);
        setBalance(balanceRes.data.balance);
        setTransactions(transRes.data);
      } catch (err) {
        console.error("Dashboard fetching error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a237e' }}>Dashboard</h1>
      
      <div style={{
        backgroundColor: '#e8eaf6',
        padding: '30px',
        borderRadius: '12px',
        margin: '20px 0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#5c6bc0', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '14px' }}>
          Virtual Wallet Balance
        </h3>
        <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a237e', margin: '0' }}>
          {loading ? "Loading..." : `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </p>
      </div>

      <p style={{ color: '#555', fontSize: '16px' }}>
        Welcome to SB Stocks! Start trading with virtual money, practice strategies, and manage your portfolio risk-free.
      </p>

      <h2 style={{ color: '#1a237e', marginTop: '40px', borderBottom: '2px solid #e0e0e0', paddingBottom: '10px' }}>
        📜 Recent Transactions
      </h2>
      
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Loading transaction history...</div>
      ) : transactions.length === 0 ? (
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '30px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#666',
          marginTop: '15px'
        }}>
          No transactions recorded yet. Go to the <strong>Stock Market</strong> page to start trading!
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginTop: '15px',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#555' }}>Stock</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#555' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>Quantity</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'right', color: '#555' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((tx, idx) => {
                const date = new Date(tx.date || tx.createdAt).toLocaleString();
                const price = tx.price || 0;
                const total = tx.quantity * price;
                const isBuy = tx.type === 'BUY';
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px', color: '#666' }}>{date}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{tx.symbol}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        backgroundColor: isBuy ? '#e8f5e9' : '#ffebee',
                        color: isBuy ? '#2e7d32' : '#c62828'
                      }}>
                        {tx.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>{tx.quantity}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>${price.toFixed(2)}</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {transactions.length > 10 && (
            <p style={{ textAlign: 'center', color: '#666', marginTop: '15px', fontSize: '14px' }}>
              Showing the 10 most recent transactions.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;