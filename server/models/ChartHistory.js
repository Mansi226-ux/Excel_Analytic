const mongoose = require("mongoose");

const ChartHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: String,
  chartType: String,
  xAxis: String,
  yAxis: String,
  zAxis: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ChartHistory", ChartHistorySchema);
