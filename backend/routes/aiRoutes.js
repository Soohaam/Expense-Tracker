const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");

router.get("/review", aiController.generateReview);

module.exports = router;