const { getAllStocks } = require("../services/marketData");

const listStocks = (req, res) => {
  return res.json({ stocks: getAllStocks() });
};

module.exports = {
  listStocks,
};
