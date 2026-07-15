const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const stockRoutes = require('./routes/stockRoutes');
const tradingRoutes = require('./routes/tradingRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch((error) => {
  console.warn('MongoDB unavailable, continuing in demo mode:', error.message);
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SB Stocks API is running' });
});

app.use('/api', authRoutes);
app.use('/api', stockRoutes);
app.use('/api', tradingRoutes);

app.use(authRoutes);
app.use(stockRoutes);
app.use(tradingRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
