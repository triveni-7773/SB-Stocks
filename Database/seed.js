require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const Portfolio = require("./models/Portfolio");
const Transaction = require("./models/Transaction");
const Stock = require("./models/Stock");

async function seedData() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await User.deleteMany({});
    await Portfolio.deleteMany({});
    await Transaction.deleteMany({});
    await Stock.deleteMany({});

    // Seed Stocks
    console.log("🌱 Seeding stocks...");
    await Stock.create([
      { symbol: "AAPL", name: "Apple Inc.", currentPrice: 200 },
      { symbol: "TSLA", name: "Tesla Inc.", currentPrice: 150 },
      { symbol: "TCS", name: "Tata Consultancy Services", currentPrice: 3500 },
    ]);
    console.log("✅ Stocks seeded");

    // Insert User
    console.log("👤 Creating user...");
    const hashedPassword = await bcrypt.hash("123456", 10);
    const user = await User.create({
      name: "Veda",
      email: "vedaangarapu12@gmail.com",
      password: hashedPassword,
      balance: 50000,
    });
    console.log("✅ User created (Email: vedaangarapu12@gmail.com, Pass: 123456)");

    // Insert Portfolio holding
    console.log("💼 Seeding portfolio...");
    await Portfolio.create({
      userId: user._id,
      symbol: "TCS",
      stockName: "Tata Consultancy Services",
      quantity: 10,
      buyPrice: 3500,
    });
    console.log("✅ Portfolio seeded");

    // Insert Transaction
    console.log("📝 Seeding transaction history...");
    await Transaction.create({
      userId: user._id,
      symbol: "TCS",
      stockName: "Tata Consultancy Services",
      type: "BUY",
      quantity: 10,
      price: 3500,
    });
    console.log("✅ Transaction seeded");

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedData();