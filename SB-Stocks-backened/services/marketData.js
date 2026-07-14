const stocks = require("../../SB-Stocks-trading/backend/data/stocks.json");

const normalizeStock = (stock) => ({
  name: stock.name,
  symbol: stock.symbol,
  price: Number(stock.price),
  currentPrice: Number(stock.price),
});

const getAllStocks = () => stocks.map(normalizeStock);

const findStockBySymbol = (symbol) => {
  if (!symbol) {
    return null;
  }

  return getAllStocks().find((stock) => stock.symbol === symbol.toUpperCase()) || null;
};

module.exports = {
  getAllStocks,
  findStockBySymbol,
};