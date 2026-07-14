const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  currentPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Stock", stockSchema);
