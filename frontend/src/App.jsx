import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Stocks from './pages/Stocks';
import Portfolio from './pages/Portfolio';

function App() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/stocks" element={isLoggedIn ? <Stocks /> : <Navigate to="/login" />} />
          <Route path="/portfolio" element={isLoggedIn ? <Portfolio /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;