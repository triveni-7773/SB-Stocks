const express = require("express");
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/transactions", authMiddleware, transactionController.getTransactions);

module.exports = router;