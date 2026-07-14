const express = require("express");
const portfolioController = require("../controllers/portfolioController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/portfolio", authMiddleware, portfolioController.getPortfolio);
router.get("/portfolio/balance", authMiddleware, portfolioController.getBalance);

module.exports = router;