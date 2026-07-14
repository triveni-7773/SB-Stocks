const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const tradeRoutes = require("./routes/tradeRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "SB Stocks API running",
    status: "ok",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

app.use("/api", authRoutes);
app.use("/api", stockRoutes);
app.use("/api", portfolioRoutes);
app.use("/api", tradeRoutes);
app.use("/api", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Server error",
  });
});

module.exports = app;