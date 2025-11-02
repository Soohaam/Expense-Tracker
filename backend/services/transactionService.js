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
async getMonthlyHeatmap(year, month) {
  try {
    // Use local timezone dates (not UTC)
    const startDate = new Date(year, month - 1, 1, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    
    console.log(`Fetching heatmap data for ${year}-${month}`);
    console.log(`Date range: ${startDate} to ${endDate}`);

    // Fetch all expense transactions for the month
    const transactions = await Transaction.find({
      type: 'expense',
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    console.log(`Found ${transactions.length} expense transactions`);

    // Get number of days in the month
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Create daily spending map
    const dailySpending = {};
    
    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailySpending[dateKey] = {
        date: dateKey, // Store as string to avoid timezone conversion
        total: 0,
        count: 0,
        transactions: [],
      };
    }

    // Populate with actual transaction data
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      // Use local date components (not UTC)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      console.log(`Transaction date: ${transaction.date} -> dateKey: ${dateKey}`);
      
      if (dailySpending[dateKey]) {
        dailySpending[dateKey].total += transaction.amount;
        dailySpending[dateKey].count += 1;
        dailySpending[dateKey].transactions.push({
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
        });
      } else {
        console.log(`⚠️ Date key ${dateKey} not found in dailySpending map`);
      }
    });

    // Convert to array
    const heatmapData = Object.values(dailySpending);

    // Calculate statistics
    const totalSpending = heatmapData.reduce((sum, day) => sum + day.total, 0);
    const activeDays = heatmapData.filter((day) => day.total > 0).length;
    const maxSpending = Math.max(...heatmapData.map((day) => day.total), 0);
    const avgDaily = daysInMonth > 0 ? totalSpending / daysInMonth : 0;

    return {
      year,
      month,
      daysInMonth,
      heatmapData,
      stats: {
        totalSpending,
        activeDays,
        maxSpending,
        avgDaily: Math.round(avgDaily),
      },
    };
  } catch (error) {
    console.error('Error in getMonthlyHeatmap:', error);
    throw error;
  }
}
}

module.exports = new TransactionService();