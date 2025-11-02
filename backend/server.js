// MUST BE FIRST - Load environment variables before anything else
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const transactionRoutes = require("./routes/transactionRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Debug: Log to verify API key is loaded
console.log("🔍 Environment Variables Check:");
console.log("PORT:", process.env.PORT);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
console.log("GEMINI_API_KEY length:", process.env.GEMINI_API_KEY?.length);
console.log("GEMINI_API_KEY first 10 chars:", process.env.GEMINI_API_KEY?.substring(0, 10));

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running successfully 🚀");
});

app.use("/api/transactions", transactionRoutes);
app.use("/api/ai", aiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API endpoint: http://localhost:${PORT}/api/transactions`);
  console.log(`🤖 AI endpoint: http://localhost:${PORT}/api/ai`);
});