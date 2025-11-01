const transactionService = require("../services/transactionService");

class TransactionController {
  // Create transaction
  async createTransaction(req, res) {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      
      res.status(201).json({
        success: true,
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to create transaction",
        error: error.message,
      });
    }
  }

  // Get all transactions
  async getTransactions(req, res) {
    try {
      const { type, category, startDate, endDate, limit, page } = req.query;
      
      const filters = {
        type,
        category,
        startDate,
        endDate,
        limit: parseInt(limit) || 100,
        skip: page ? (parseInt(page) - 1) * (parseInt(limit) || 100) : 0,
      };

      const result = await transactionService.getTransactions(filters);
      
      res.status(200).json({
        success: true,
        data: result.transactions,
        pagination: {
          total: result.total,
          page: parseInt(page) || 1,
          limit: parseInt(limit) || 100,
          pages: Math.ceil(result.total / (parseInt(limit) || 100)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch transactions",
        error: error.message,
      });
    }
  }

  // Get transaction by ID
  async getTransactionById(req, res) {
    try {
      const transaction = await transactionService.getTransactionById(
        req.params.id
      );
      
      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      if (error.message === "Transaction not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to fetch transaction",
        error: error.message,
      });
    }
  }

  // Update transaction
  async updateTransaction(req, res) {
    try {
      const transaction = await transactionService.updateTransaction(
        req.params.id,
        req.body
      );
      
      res.status(200).json({
        success: true,
        message: "Transaction updated successfully",
        data: transaction,
      });
    } catch (error) {
      if (error.message === "Transaction not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      
      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to update transaction",
        error: error.message,
      });
    }
  }

  // Delete transaction
  async deleteTransaction(req, res) {
    try {
      await transactionService.deleteTransaction(req.params.id);
      
      res.status(200).json({
        success: true,
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      if (error.message === "Transaction not found") {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to delete transaction",
        error: error.message,
      });
    }
  }

  // Get summary
  async getSummary(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      const summary = await transactionService.getSummary({
        startDate,
        endDate,
      });
      
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch summary",
        error: error.message,
      });
    }
  }

  // Get category breakdown
  async getCategoryBreakdown(req, res) {
    try {
      const { type } = req.query;
      
      const breakdown = await transactionService.getCategoryBreakdown(type);
      
      res.status(200).json({
        success: true,
        data: breakdown,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch category breakdown",
        error: error.message,
      });
    }
  }
}

module.exports = new TransactionController();