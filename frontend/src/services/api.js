import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authAPI = {
  register: (userData) => api.post('/register', userData),
  login: (credentials) => api.post('/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export const stockAPI = {
  getAllStocks: () => api.get('/stocks'),
};

export const tradingAPI = {
  buyStock: (data) => api.post('/trade/buy', data),
  sellStock: (data) => api.post('/trade/sell', data),
};

export const portfolioAPI = {
  getPortfolio: () => api.get('/portfolio'),
  getBalance: () => api.get('/portfolio/balance'),
};

export default api;