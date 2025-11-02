const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

// Transaction CRUD routes
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.get("/summary", transactionController.getSummary);
router.get("/breakdown", transactionController.getCategoryBreakdown);
router.get("/heatmap", transactionController.getMonthlyHeatmap);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;