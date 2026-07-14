require("dotenv").config({ path: require("path").join(__dirname, "../Database/.env") });

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

// Models
const User = require("./models/User");
const Stock = require("./models/Stock");
const Portfolio = require("./models/Portfolio");
const Transaction = require("./models/Transaction");

// Middleware
const auth = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "sb_stocks_secret_key";

// Root test route
app.get("/", (req, res) => {
  res.json({
    message: "SB Stocks API running",
  });
});

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================

// Register Route
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    user = await User.create({
      name,
      email,
      password: hashedPassword,
      balance: 50000, // starting virtual balance
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ==========================================
// 2. STOCK ROUTES
// ==========================================

// Get all stocks
app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.json(stocks);
  } catch (err) {
    console.error("Fetch stocks error:", err.message);
    res.status(500).json({ message: "Server error fetching stocks" });
  }
});

// ==========================================
// 3. TRADING & PORTFOLIO ROUTES (AUTHENTICATED)
// ==========================================

// Buy Stock Route
app.post("/api/trade/buy", auth, async (req, res) => {
  try {
    const symbol = req.body.symbol || req.body.stockName;
    const quantity = Number(req.body.quantity);

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid stock symbol or quantity" });
    }

    // Find stock current price
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: `Stock ${symbol} not found` });
    }

    const cost = stock.currentPrice * quantity;

    // Check balance
    if (req.user.balance < cost) {
      return res.status(400).json({ message: "Insufficient balance for this purchase" });
    }

    // Deduct from balance
    req.user.balance -= cost;
    await req.user.save();

    // Check if user already holds this stock
    let portfolioItem = await Portfolio.findOne({ userId: req.user._id, symbol: stock.symbol });

    if (portfolioItem) {
      // Calculate new average purchase price (weighted average)
      const currentTotalCost = portfolioItem.quantity * portfolioItem.buyPrice;
      const newTotalCost = currentTotalCost + cost;
      portfolioItem.quantity += quantity;
      portfolioItem.buyPrice = newTotalCost / portfolioItem.quantity;
      await portfolioItem.save();
    } else {
      // Create new holding
      portfolioItem = await Portfolio.create({
        userId: req.user._id,
        symbol: stock.symbol,
        stockName: stock.name,
        quantity: quantity,
        buyPrice: stock.currentPrice,
      });
    }

    // Record transaction
    await Transaction.create({
      userId: req.user._id,
      symbol: stock.symbol,
      stockName: stock.name,
      type: "BUY",
      quantity,
      price: stock.currentPrice,
    });

    res.json({
      message: `Successfully bought ${quantity} shares of ${stock.symbol}`,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        balance: req.user.balance,
      },
    });
  } catch (err) {
    console.error("Buy trade error:", err.message);
    res.status(500).json({ message: "Server error performing buy trade" });
  }
});

// Sell Stock Route
app.post("/api/trade/sell", auth, async (req, res) => {
  try {
    const symbol = req.body.symbol || req.body.stockName;
    const quantity = Number(req.body.quantity);

    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid stock symbol or quantity" });
    }

    // Find stock current price
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({ message: `Stock ${symbol} not found` });
    }

    // Check if user owns the stock and has enough quantity
    const portfolioItem = await Portfolio.findOne({ userId: req.user._id, symbol: stock.symbol });
    if (!portfolioItem || portfolioItem.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient shares in portfolio to sell" });
    }

    const earnings = stock.currentPrice * quantity;

    // Add earnings to balance
    req.user.balance += earnings;
    await req.user.save();

    // Update or remove holding
    portfolioItem.quantity -= quantity;
    if (portfolioItem.quantity === 0) {
      await Portfolio.findByIdAndDelete(portfolioItem._id);
    } else {
      await portfolioItem.save();
    }

    // Record transaction
    await Transaction.create({
      userId: req.user._id,
      symbol: stock.symbol,
      stockName: stock.name,
      type: "SELL",
      quantity,
      price: stock.currentPrice,
    });

    res.json({
      message: `Successfully sold ${quantity} shares of ${stock.symbol}`,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        balance: req.user.balance,
      },
    });
  } catch (err) {
    console.error("Sell trade error:", err.message);
    res.status(500).json({ message: "Server error performing sell trade" });
  }
});

// Get User's Portfolio holdings
app.get("/api/portfolio", auth, async (req, res) => {
  try {
    const holdings = await Portfolio.find({ userId: req.user._id });
    
    // Enrich holdings with latest stock prices
    const enrichedHoldings = await Promise.all(
      holdings.map(async (holding) => {
        const stock = await Stock.findOne({ symbol: holding.symbol });
        return {
          symbol: holding.symbol,
          stockName: holding.stockName,
          quantity: holding.quantity,
          buyPrice: holding.buyPrice,
          currentPrice: stock ? stock.currentPrice : holding.buyPrice,
        };
      })
    );

    res.json(enrichedHoldings);
  } catch (err) {
    console.error("Fetch portfolio error:", err.message);
    res.status(500).json({ message: "Server error fetching portfolio" });
  }
});

// Get User's Balance Route
app.get("/api/portfolio/balance", auth, async (req, res) => {
  try {
    res.json({ balance: req.user.balance });
  } catch (err) {
    console.error("Fetch balance error:", err.message);
    res.status(500).json({ message: "Server error fetching balance" });
  }
});

// Get User's Transaction History
app.get("/api/transactions", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Fetch transactions error:", err.message);
    res.status(500).json({ message: "Server error fetching transactions" });
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
};

startServer();