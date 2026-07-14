const User = require("../../Database/models/User");
const Portfolio = require("../../Database/models/Portfolio");
const Transaction = require("../../Database/models/Transaction");
const { findStockBySymbol } = require("./marketData");

const toPositiveInteger = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const buildPortfolioItem = (stock, portfolioItem) => ({
  symbol: stock.symbol,
  stockName: stock.name,
  quantity: portfolioItem.quantity,
  buyPrice: portfolioItem.buyPrice,
  currentPrice: stock.currentPrice,
  totalValue: Number((portfolioItem.quantity * stock.currentPrice).toFixed(2)),
  profitLoss: Number(((stock.currentPrice - portfolioItem.buyPrice) * portfolioItem.quantity).toFixed(2)),
});

class TradingService {
  async getPortfolio(userId) {
    const portfolioItems = await Portfolio.find({ userId }).sort({ symbol: 1 });

    return portfolioItems
      .map((item) => {
        const stockKey = item.symbol || item.stockName;
        const stock = findStockBySymbol(stockKey);

        if (!stock) {
          return null;
        }

        return buildPortfolioItem(stock, item);
      })
      .filter(Boolean);
  }

  async getBalance(userId) {
    const user = await User.findById(userId).select("balance");

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return user.balance;
  }

  async getTransactions(userId) {
    return Transaction.find({ userId }).sort({ createdAt: -1 });
  }

  async buyStock({ userId, symbol, quantity }) {
    const normalizedQuantity = toPositiveInteger(quantity);

    if (!normalizedQuantity) {
      const error = new Error("Quantity must be a positive integer");
      error.statusCode = 400;
      throw error;
    }

    const stock = findStockBySymbol(symbol);

    if (!stock) {
      const error = new Error("Stock not found");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const cost = Number((stock.currentPrice * normalizedQuantity).toFixed(2));

    if (user.balance < cost) {
      const error = new Error("Insufficient balance");
      error.statusCode = 400;
      throw error;
    }

    const existingHolding = await Portfolio.findOne({ userId, symbol: stock.symbol });
    const nextBalance = Number((user.balance - cost).toFixed(2));

    if (existingHolding) {
      const totalQuantity = existingHolding.quantity + normalizedQuantity;
      const totalCost = existingHolding.buyPrice * existingHolding.quantity + cost;

      existingHolding.quantity = totalQuantity;
      existingHolding.buyPrice = Number((totalCost / totalQuantity).toFixed(2));
      await existingHolding.save();
    } else {
      await Portfolio.create({
        userId,
        symbol: stock.symbol,
        stockName: stock.name,
        quantity: normalizedQuantity,
        buyPrice: stock.currentPrice,
      });
    }

    user.balance = nextBalance;
    await user.save();

    await Transaction.create({
      userId,
      symbol: stock.symbol,
      stockName: stock.name,
      type: "BUY",
      quantity: normalizedQuantity,
    });

    return {
      balance: user.balance,
      stock,
    };
  }

  async sellStock({ userId, symbol, quantity }) {
    const normalizedQuantity = toPositiveInteger(quantity);

    if (!normalizedQuantity) {
      const error = new Error("Quantity must be a positive integer");
      error.statusCode = 400;
      throw error;
    }

    const stock = findStockBySymbol(symbol);

    if (!stock) {
      const error = new Error("Stock not found");
      error.statusCode = 404;
      throw error;
    }

    const holding = await Portfolio.findOne({ userId, symbol: stock.symbol });

    if (!holding || holding.quantity < normalizedQuantity) {
      const error = new Error("Not enough shares to sell");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findById(userId);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const proceeds = Number((stock.currentPrice * normalizedQuantity).toFixed(2));

    holding.quantity -= normalizedQuantity;

    if (holding.quantity === 0) {
      await holding.deleteOne();
    } else {
      await holding.save();
    }

    user.balance = Number((user.balance + proceeds).toFixed(2));
    await user.save();

    await Transaction.create({
      userId,
      symbol: stock.symbol,
      stockName: stock.name,
      type: "SELL",
      quantity: normalizedQuantity,
    });

    return {
      balance: user.balance,
      stock,
    };
  }
}

module.exports = new TradingService();