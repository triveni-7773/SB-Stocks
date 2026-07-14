const express = require("express");
const stockController = require("../controllers/stockController");

const router = express.Router();

router.get("/stocks", stockController.listStocks);

module.exports = router;