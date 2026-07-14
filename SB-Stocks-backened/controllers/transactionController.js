const tradingService = require("../services/tradingService");

const getTransactions = async (req, res) => {
  try {
    const transactions = await tradingService.getTransactions(req.user._id);
    return res.json({ transactions });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Server error fetching transactions",
    });
  }
};

module.exports = {
  getTransactions,
};
