import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1a237e' }}>Dashboard</h1>
      <div style={{
        backgroundColor: '#e8eaf6',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px 0'
      }}>
        <h3>Your Balance</h3>
        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a237e' }}>
          $10,000.00
        </p>
      </div>
      <p>Welcome to SB Stocks! Start trading with virtual money.</p>
    </div>
  );
};

export default Dashboard;