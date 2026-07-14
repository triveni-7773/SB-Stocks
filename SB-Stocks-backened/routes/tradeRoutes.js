const express = require("express");
const tradeController = require("../controllers/tradeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/trade/buy", authMiddleware, tradeController.buyStock);
router.post("/trade/sell", authMiddleware, tradeController.sellStock);

module.exports = router;