const tradingService = require("../services/tradingService");

const getPortfolio = async (req, res) => {
  try {
    const portfolio = await tradingService.getPortfolio(req.user._id);
    return res.json({ portfolio });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error fetching portfolio",
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const balance = await tradingService.getBalance(req.user._id);
    return res.json({ balance });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error fetching balance",
    });
  }
};

module.exports = {
  getPortfolio,
  getBalance,
};
