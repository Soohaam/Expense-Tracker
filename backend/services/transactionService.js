const Transaction = require("../models/Transaction");

class TransactionService {
  // Create a new transaction
  async createTransaction(transactionData) {
    try {
      const transaction = new Transaction(transactionData);
      await transaction.save();
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  // Get all transactions with filters
  async getTransactions(filters = {}) {
    try {
      const { type, category, startDate, endDate, limit, skip } = filters;
      
      const query = {};

      // Apply filters
      if (type) {
        query.type = type.toLowerCase();
      }

      if (category) {
        query.category = category.toLowerCase();
      }

      if (startDate || endDate) {
        query.date = {};
        if (startDate) {
          query.date.$gte = new Date(startDate);
        }
        if (endDate) {
          query.date.$lte = new Date(endDate);
        }
      }

      const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .limit(limit || 100)
        .skip(skip || 0);

      const total = await Transaction.countDocuments(query);

      return { transactions, total };
    } catch (error) {
      throw error;
    }
  }

  // Get transaction by ID
  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findById(id);
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  // Update a transaction
  async updateTransaction(id, updateData) {
    try {
      const transaction = await Transaction.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  // Delete a transaction
  async deleteTransaction(id) {
    try {
      const transaction = await Transaction.findByIdAndDelete(id);
      
      if (!transaction) {
        throw new Error("Transaction not found");
      }
      
      return transaction;
    } catch (error) {
      throw error;
    }
  }

  // Get summary statistics
  async getSummary(filters = {}) {
    try {
      const { startDate, endDate } = filters;
      
      const matchStage = {};
      
      if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) {
          matchStage.date.$gte = new Date(startDate);
        }
        if (endDate) {
          matchStage.date.$lte = new Date(endDate);
        }
      }

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]);

      const income = summary.find((item) => item._id === "income") || {
        total: 0,
        count: 0,
      };
      const expense = summary.find((item) => item._id === "expense") || {
        total: 0,
        count: 0,
      };

      const balance = income.total - expense.total;

      return {
        income: income.total,
        expense: expense.total,
        balance,
        incomeCount: income.count,
        expenseCount: expense.count,
        totalTransactions: income.count + expense.count,
      };
    } catch (error) {
      throw error;
    }
  }

  // Get category-wise breakdown
  async getCategoryBreakdown(type) {
    try {
      const matchStage = {};
      if (type) {
        matchStage.type = type.toLowerCase();
      }

      const breakdown = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: { type: "$type", category: "$category" },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            type: "$_id.type",
            category: "$_id.category",
            total: 1,
            count: 1,
          },
        },
        { $sort: { total: -1 } },
      ]);

      return breakdown;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new TransactionService();