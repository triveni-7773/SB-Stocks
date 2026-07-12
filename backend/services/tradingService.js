const stocks = require("../data/stocks.json");

class TradingService {
  constructor(user) {
    this.user = user; // user has balance and portfolio
  }

  // Buy shares
  buy(symbol, quantity) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) throw new Error("Stock not found");

    const cost = stock.price * quantity;

    if (this.user.balance < cost) {
      throw new Error("Not enough balance");
    }

    this.user.balance -= cost;

    if (!this.user.portfolio[symbol]) {
      this.user.portfolio[symbol] = { shares: 0, purchasePrice: stock.price };
    }
    this.user.portfolio[symbol].shares += quantity;

    return this.user;
  }

  // Sell shares
  sell(symbol, quantity) {
    const stock = stocks.find(s => s.symbol === symbol);
    if (!stock) throw new Error("Stock not found");

    if (!this.user.portfolio[symbol] || this.user.portfolio[symbol].shares < quantity) {
      throw new Error("Not enough shares to sell");
    }

    this.user.portfolio[symbol].shares -= quantity;
    this.user.balance += stock.price * quantity;

    return this.user;
  }

  // Profit calculation
  calculateProfit(symbol) {
    const stock = stocks.find(s => s.symbol === symbol);
    const holding = this.user.portfolio[symbol];

    if (!holding) return 0;

    const currentValue = stock.price * holding.shares;
    const purchaseValue = holding.purchasePrice * holding.shares;

    return currentValue - purchaseValue;
  }
}

module.exports = TradingService;