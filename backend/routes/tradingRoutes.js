const express = require('express');
const { buyStock, sellStock, getPortfolioForUser, getBalance, createDemoUser } = require('../utils/inMemoryStore');

const router = express.Router();

const stockPrices = {
  AAPL: 200,
  TSLA: 150,
  MSFT: 420,
  GOOGL: 180
};

router.post('/buy', async (req, res) => {
  try {
    const { symbol, quantity, userId } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({ message: 'Symbol and quantity are required' });
    }

    const price = stockPrices[symbol.toUpperCase()];
    if (!price) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const resolvedUserId = userId || 'demo-user';
    createDemoUser();
    const result = buyStock(resolvedUserId, symbol.toUpperCase(), Number(quantity), price);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Buy order placed successfully', portfolio: result.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
});

router.post('/trade/buy', async (req, res) => {
  try {
    const { symbol, quantity, userId } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({ message: 'Symbol and quantity are required' });
    }

    const price = stockPrices[symbol.toUpperCase()];
    if (!price) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const resolvedUserId = userId || 'demo-user';
    createDemoUser();
    const result = buyStock(resolvedUserId, symbol.toUpperCase(), Number(quantity), price);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Buy order placed successfully', portfolio: result.portfolio });
  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
});

router.post('/sell', async (req, res) => {
  try {
    const { symbol, quantity, userId } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({ message: 'Symbol and quantity are required' });
    }

    const price = stockPrices[symbol.toUpperCase()];
    if (!price) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const resolvedUserId = userId || 'demo-user';
    createDemoUser();
    const result = sellStock(resolvedUserId, symbol.toUpperCase(), Number(quantity), price);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Sell order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
});

router.post('/trade/sell', async (req, res) => {
  try {
    const { symbol, quantity, userId } = req.body;

    if (!symbol || !quantity) {
      return res.status(400).json({ message: 'Symbol and quantity are required' });
    }

    const price = stockPrices[symbol.toUpperCase()];
    if (!price) {
      return res.status(404).json({ message: 'Stock not found' });
    }

    const resolvedUserId = userId || 'demo-user';
    createDemoUser();
    const result = sellStock(resolvedUserId, symbol.toUpperCase(), Number(quantity), price);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Sell order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Trade failed', error: error.message });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo-user';
    const portfolio = getPortfolioForUser(userId);

    const formatted = portfolio.map((item) => ({
      ...item,
      currentPrice: stockPrices[item.symbol] || 0,
      totalValue: (stockPrices[item.symbol] || 0) * item.quantity,
      profitLoss: ((stockPrices[item.symbol] || 0) - item.buyPrice) * item.quantity
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch portfolio', error: error.message });
  }
});

router.get('/portfolio/balance', async (req, res) => {
  try {
    const userId = req.query.userId || 'demo-user';
    res.json({ balance: getBalance(userId) });
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch balance', error: error.message });
  }
});

module.exports = router;
