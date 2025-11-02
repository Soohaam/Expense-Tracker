const aiService = require("../services/aiService");

class AIController {
  async generateReview(req, res) {
    try {
      console.log("AI Review request received");
      console.log("Query params:", req.query);

      const { startDate, endDate } = req.query;

      const result = await aiService.generateFinancialReview({
        startDate,
        endDate,
      });

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }

      res.status(200).json({
        success: true,
        data: {
          review: result.review,
          analysisData: result.analysisData,
        },
      });
    } catch (error) {
      console.error("❌ AI Controller Error:", error.message);
      console.error("Full error:", error);
      
      res.status(500).json({
        success: false,
        message: "Failed to generate AI review. Please check your API key and try again.",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

module.exports = new AIController();