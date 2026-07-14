const tradingService = require("../services/tradingService");

const buyStock = async (req, res) => {
  try {
    const symbol = req.body.symbol || req.body.stockName;
    const { quantity } = req.body;
    const result = await tradingService.buyStock({
      userId: req.user._id,
      symbol,
      quantity,
    });

    return res.json({
      message: `Successfully bought ${quantity} shares of ${result.stock.symbol}`,
      balance: result.balance,
      stock: result.stock,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error performing buy trade",
    });
  }
};

const sellStock = async (req, res) => {
  try {
    const symbol = req.body.symbol || req.body.stockName;
    const { quantity } = req.body;
    const result = await tradingService.sellStock({
      userId: req.user._id,
      symbol,
      quantity,
    });

    return res.json({
      message: `Successfully sold ${quantity} shares of ${result.stock.symbol}`,
      balance: result.balance,
      stock: result.stock,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error performing sell trade",
    });
  }
};

module.exports = {
  buyStock,
  sellStock,
};
