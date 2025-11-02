const mongoose = require('mongoose');
require('dotenv').config();

// Transaction Schema (inline for seed file)
const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['income', 'expense'],
  },
  amount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);

// Realistic transaction templates
const transactionTemplates = {
  income: [
    { category: 'salary', descriptions: ['Monthly Salary October', 'Salary Credit'], amounts: [45000, 50000, 55000, 60000] },
    { category: 'freelance', descriptions: ['Freelance Project Payment', 'Client Payment - Web Development', 'Consulting Fees'], amounts: [8000, 12000, 15000, 20000] },
    { category: 'investment', descriptions: ['Dividend Payment', 'Stock Returns', 'Mutual Fund Returns'], amounts: [2000, 3000, 5000] },
    { category: 'bonus', descriptions: ['Performance Bonus', 'Festival Bonus'], amounts: [10000, 15000, 20000] },
  ],
  expense: [
    { category: 'groceries', descriptions: ['Weekly Groceries - Reliance Fresh', 'Big Bazaar Shopping', 'DMart Groceries', 'Local Kirana Store'], amounts: [1200, 1500, 2000, 2500, 800] },
    { category: 'food', descriptions: ['Zomato Order', 'Swiggy Dinner', 'Restaurant - Lunch', 'Cafe Coffee Day', 'McDonald\'s', 'Dominos Pizza'], amounts: [250, 350, 450, 600, 800, 200, 150] },
    { category: 'transport', descriptions: ['Uber Ride', 'Ola Cab', 'Petrol - HP', 'Metro Card Recharge', 'Auto Rickshaw'], amounts: [150, 200, 300, 500, 1000, 1500, 80, 60] },
    { category: 'shopping', descriptions: ['Amazon Shopping', 'Flipkart Order', 'Myntra Clothes', 'Lifestyle Store', 'Shoe Purchase'], amounts: [1500, 2000, 3000, 4000, 5000, 800] },
    { category: 'entertainment', descriptions: ['Movie Tickets - PVR', 'Netflix Subscription', 'Spotify Premium', 'Gaming - Steam', 'Concert Tickets'], amounts: [500, 800, 199, 149, 2000, 1200] },
    { category: 'bills', descriptions: ['Electricity Bill', 'Internet Bill - Airtel', 'Mobile Recharge', 'Water Bill', 'Gas Cylinder'], amounts: [1500, 799, 399, 500, 900, 300] },
    { category: 'healthcare', descriptions: ['Medical Store', 'Doctor Consultation', 'Pharmacy - Apollo', 'Health Checkup', 'Gym Membership'], amounts: [500, 800, 1500, 3000, 1000, 2000] },
    { category: 'education', descriptions: ['Online Course - Udemy', 'Book Purchase - Amazon', 'Coursera Subscription', 'Study Materials'], amounts: [500, 800, 1200, 2000, 400] },
  ],
};

// Generate random date between Oct 10 and Nov 1
function getRandomDate() {
  const start = new Date(2025, 9, 10); // Oct 10, 2025 (month is 0-indexed)
  const end = new Date(2025, 10, 1);   // Nov 1, 2025
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  return new Date(randomTime);
}


function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateTransactions() {
  const transactions = [];
  
  const incomeCount = 8 + Math.floor(Math.random() * 3);
  for (let i = 0; i < incomeCount; i++) {
    const template = getRandomItem(transactionTemplates.income);
    transactions.push({
      type: 'income',
      category: template.category,
      description: getRandomItem(template.descriptions),
      amount: getRandomItem(template.amounts),
      date: getRandomDate(),
    });
  }
  
  // Expense transactions (50-60 for the month)
  const expenseCount = 50 + Math.floor(Math.random() * 11);
  for (let i = 0; i < expenseCount; i++) {
    const template = getRandomItem(transactionTemplates.expense);
    transactions.push({
      type: 'expense',
      category: template.category,
      description: getRandomItem(template.descriptions),
      amount: getRandomItem(template.amounts),
      date: getRandomDate(),
    });
  }
  
  // Add some specific dated transactions for realism
  
  // Salary on Oct 1st (last month)
  transactions.push({
    type: 'income',
    category: 'salary',
    description: 'Monthly Salary - October',
    amount: 50000,
    date: new Date(2025, 9, 1),
  });
  
  // Rent payment on Oct 5th
  transactions.push({
    type: 'expense',
    category: 'bills',
    description: 'House Rent Payment',
    amount: 1000,
    date: new Date(2025, 9, 5),
  });
  
  // Electricity bill on Oct 10th
  transactions.push({
    type: 'expense',
    category: 'bills',
    description: 'Electricity Bill - October',
    amount: 1800,
    date: new Date(2025, 9, 10),
  });
  
  // Diwali shopping on Oct 20-25
  const diwaliDates = [20, 21, 22, 23, 24, 25];
  diwaliDates.forEach(day => {
    transactions.push({
      type: 'expense',
      category: 'shopping',
      description: 'Diwali Shopping',
      amount: 2000 + Math.floor(Math.random() * 3000),
      date: new Date(2025, 9, day),
    });
  });
  
  // Diwali bonus on Oct 24
  transactions.push({
    type: 'income',
    category: 'bonus',
    description: 'Diwali Bonus',
    amount: 15000,
    date: new Date(2025, 9, 24),
  });
  
  // Sort by date
  transactions.sort((a, b) => a.date - b.date);
  
  return transactions;
}

// Seed function
async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/expense', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // Clear existing transactions (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing transactions...');
    await Transaction.deleteMany({});
    console.log('✅ Cleared existing transactions');
    
    // Generate transactions
    console.log('📝 Generating transactions...');
    const transactions = generateTransactions();
    console.log(`✅ Generated ${transactions.length} transactions`);
    
    // Insert transactions
    console.log('💾 Inserting transactions into database...');
    await Transaction.insertMany(transactions);
    console.log('✅ Successfully inserted all transactions');
    
    // Summary
    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
    
    console.log('\n📊 Summary:');
    console.log(`   Total Transactions: ${transactions.length}`);
    console.log(`   Income Transactions: ${income.length}`);
    console.log(`   Expense Transactions: ${expenses.length}`);
    console.log(`   Total Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    console.log(`   Total Expense: ₹${totalExpense.toLocaleString('en-IN')}`);
    console.log(`   Balance: ₹${(totalIncome - totalExpense).toLocaleString('en-IN')}`);
    console.log('\n✨ Database seeded successfully!\n');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
