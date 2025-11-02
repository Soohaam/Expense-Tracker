const { GoogleGenerativeAI } = require("@google/generative-ai");
const Transaction = require("../models/Transaction");

class AIService {
  constructor() {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("❌ GEMINI_API_KEY is not set in environment variables");
    } else {
      console.log("✅ GEMINI_API_KEY found");
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateFinancialReview(filters = {}) {
    try {
      console.log("Starting AI review generation...");
      
      // Fetch transactions based on filters
      const { startDate, endDate } = filters;
      const query = {};

      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      console.log("Fetching transactions with query:", query);
      const transactions = await Transaction.find(query).sort({ date: -1 });
      console.log(`Found ${transactions.length} transactions`);

      if (transactions.length === 0) {
        return {
          success: false,
          message: "No transactions found to analyze. Please add some transactions first.",
        };
      }

      // Prepare data for AI analysis
      console.log("Preparing data for AI...");
      const analysisData = this.prepareDataForAI(transactions);

      // Create prompt for Gemini
      const prompt = this.createPrompt(analysisData);
      console.log("Prompt created, sending to Gemini AI...");

      // Generate content using Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiReview = response.text();
      
      console.log("✅ AI review generated successfully");
      try {
  console.log("🧩 Sending prompt to Gemini...");
  const result = await this.model.generateContent(prompt);
  console.log("✅ Gemini raw result:", result); // <— add this line

  const response = result.response;
  const aiReview = response.text();

  return {
    success: true,
    review: aiReview,
  };
} catch (error) {
  console.error("❌ Gemini API Error:", error.message);
  console.error("Full Error:", error);
  throw error;
}


      return {
        success: true,
        review: aiReview,
        analysisData: analysisData.summary,
      };
    } catch (error) {
      console.error("❌ AI Service Error:", error.message);
      console.error("Full error:", error);
      throw new Error(`AI Review failed: ${error.message}`);
    }
  }

  prepareDataForAI(transactions) {
    try {
      // Calculate summary statistics
      const summary = {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        transactionCount: transactions.length,
        dateRange: {
          start: transactions[transactions.length - 1]?.date || new Date(),
          end: transactions[0]?.date || new Date(),
        },
      };

      // Category breakdown
      const categoryBreakdown = {
        income: {},
        expense: {},
      };

      // Monthly analysis
      const monthlyData = {};

      transactions.forEach((transaction) => {
        const amount = transaction.amount;
        const type = transaction.type;
        const category = transaction.category;
        const month = new Date(transaction.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        });

        // Update summary
        if (type === "income") {
          summary.totalIncome += amount;
        } else {
          summary.totalExpense += amount;
        }

        // Update category breakdown
        if (!categoryBreakdown[type][category]) {
          categoryBreakdown[type][category] = {
            total: 0,
            count: 0,
            transactions: [],
          };
        }
        categoryBreakdown[type][category].total += amount;
        categoryBreakdown[type][category].count += 1;
        categoryBreakdown[type][category].transactions.push({
          amount,
          description: transaction.description,
          date: transaction.date,
        });

        // Update monthly data
        if (!monthlyData[month]) {
          monthlyData[month] = { income: 0, expense: 0 };
        }
        monthlyData[month][type] += amount;
      });

      summary.balance = summary.totalIncome - summary.totalExpense;

      // Find top spending categories
      const topExpenseCategories = Object.entries(categoryBreakdown.expense)
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, 5)
        .map(([category, data]) => ({
          category,
          total: data.total,
          count: data.count,
          percentage: summary.totalExpense > 0 
            ? ((data.total / summary.totalExpense) * 100).toFixed(2) 
            : 0,
        }));

      // Find unusual transactions (high amounts)
      const expenseTransactions = transactions.filter(t => t.type === 'expense');
      const avgExpense = expenseTransactions.length > 0 
        ? summary.totalExpense / expenseTransactions.length 
        : 0;
      
      const unusualTransactions = transactions
        .filter(t => t.type === 'expense' && t.amount > avgExpense * 2)
        .slice(0, 5)
        .map(t => ({
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date,
        }));

      return {
        summary,
        categoryBreakdown,
        monthlyData,
        topExpenseCategories,
        unusualTransactions,
        recentTransactions: transactions.slice(0, 10).map((t) => ({
          type: t.type,
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date,
        })),
      };
    } catch (error) {
      console.error("Error preparing data:", error);
      throw error;
    }
  }

  createPrompt(data) {
    return `You are a professional financial advisor AI. Analyze the following financial data and provide a comprehensive review with actionable advice.

**Financial Summary:**
- Total Income: ₹${data.summary.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${data.summary.totalExpense.toLocaleString('en-IN')}
- Current Balance: ₹${data.summary.balance.toLocaleString('en-IN')}
- Total Transactions: ${data.summary.transactionCount}

**Top Spending Categories:**
${data.topExpenseCategories.map(cat => 
  `- ${cat.category}: ₹${cat.total.toLocaleString('en-IN')} (${cat.percentage}% of total expenses)`
).join('\n')}

**Monthly Breakdown:**
${Object.entries(data.monthlyData).map(([month, amounts]) => 
  `- ${month}: Income ₹${amounts.income.toLocaleString('en-IN')}, Expenses ₹${amounts.expense.toLocaleString('en-IN')}`
).join('\n')}

${data.unusualTransactions.length > 0 ? `**Unusual High-Value Transactions:**
${data.unusualTransactions.map(t => 
  `- ₹${t.amount.toLocaleString('en-IN')} on ${t.category} (${t.description})`
).join('\n')}` : ''}

**Instructions:**
Provide a comprehensive financial review with the following sections:

## 📊 Financial Overview
Summarize the overall financial health in 2-3 sentences.

## 💰 Income Analysis
Comment on income patterns and stability.

## 💸 Expense Analysis
Analyze spending patterns and identify trends.

## 🎯 Top Spending Categories
Discuss the top spending categories and if they're reasonable.

## ⚠️ Areas of Concern
Identify 2-3 specific areas that need attention.

## ✅ Positive Highlights
Mention 2-3 positive aspects of the financial behavior.

## 💡 Recommendations
Provide 5-7 specific, actionable recommendations with estimated savings/benefits.

## 🎖️ Financial Health Rating
Rate as: Excellent / Good / Fair / Needs Improvement
Explain the rating briefly.

Keep the tone professional, encouraging, and specific with numbers.`;
  }
}

module.exports = new AIService();