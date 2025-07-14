// routes/chartRoutes.js
const express = require("express");
const router = express.Router();
const ChartHistory = require("../models/ChartHistory.js");
const auth = require("../middleware/auth.js");

// Save generated chart info
router.post("/save", auth, async (req, res) => {
  try {
    const { filename, chartType, xAxis, yAxis, zAxis } = req.body;

    const newEntry = new ChartHistory({
      userId: req.user.id,
      filename,
      chartType,
      xAxis,
      yAxis,
      zAxis,
    });

    await newEntry.save();
    res.status(201).json({ message: "Chart saved to history" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save chart" });
  }
});

// Get all chart history for user
router.get("/history", auth, async (req, res) => {
  try {
    const charts = await ChartHistory.find({
      userId: req.user.id,
    }).sort({ timestamp: -1 });

    res.status(200).json(charts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

//delete charts by id
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedCharts = await ChartHistory.findByIdAndDelete(req.params.id);
    if (!deletedCharts)
      return res.status(404).json({ message: "Charts not found" });
    res.json({ message: "Charts deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
