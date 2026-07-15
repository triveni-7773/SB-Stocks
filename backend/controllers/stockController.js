const stocks = [
  { name: 'Apple', symbol: 'AAPL', price: 200 },
  { name: 'Tesla', symbol: 'TSLA', price: 150 },
  { name: 'Microsoft', symbol: 'MSFT', price: 420 },
  { name: 'Google', symbol: 'GOOGL', price: 180 }
];

const getStocks = (req, res) => {
  res.json(stocks);
};

module.exports = { getStocks };
