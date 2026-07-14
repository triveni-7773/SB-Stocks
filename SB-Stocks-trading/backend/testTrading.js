const TradingService = require("./services/tradingService");

let user = {
  balance: 10000,
  portfolio: {}
};

const trading = new TradingService(user);

console.log("Buying 5 Apple shares...");
trading.buy("AAPL", 5);
console.log(user);

console.log("Selling 2 Apple shares...");
trading.sell("AAPL", 2);
console.log(user);

console.log("Profit on Apple:", trading.calculateProfit("AAPL"));
