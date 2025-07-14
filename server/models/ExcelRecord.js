const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    data: Array,
    originalname: String,
    size: Number,
    chartCount: { type: Number, default: 0 },
    insightCount: { type: Number, default: 0 },
    totalRows: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
