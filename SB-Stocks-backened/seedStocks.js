require("dotenv").config({ path: "../Database/.env" });

const connectDB = require("./config/db");
const Stock = require("./models/Stock");

async function seedStocks() {
  try {
    await connectDB();

    await Stock.insertMany([
      { symbol: "AAPL", name: "Apple Inc.", currentPrice: 200 },
      { symbol: "TSLA", name: "Tesla Inc.", currentPrice: 150 },
      { symbol: "TCS", name: "Tata Consultancy Services", currentPrice: 3500 }
    ]);

    console.log("Stocks added successfully!");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedStocks();