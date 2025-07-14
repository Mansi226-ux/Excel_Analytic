const user = require("../models/User.model.js");
const upload = require("../models/ExcelRecord.js");
const ChartHistory = require("../models/ChartHistory.js");

const getAllUsers = async (req, res) => {
  try {
    const users = await user.find().select("-password");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    await user.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllUploadedFiles = async (req, res) => {
  try {
    const files = await upload
      .find()
      .sort({ createdAt: -1 })
      .populate({ path: "userId", model: "user", select: "name email" });

    const formatted = files.map((file) => ({
      id: file._id,
      userId: file.userId?._id
        ? file.userId._id.toString()
        : file.userId
        ? file.userId.toString()
        : undefined,
      originalName: file.originalname,
      createdAt: file.createdAt,
      rowCount: file.totalRows || 0,
      user: {
        name: file.userId && file.userId.name ? file.userId.name : "Unknown",
        email: file.userId && file.userId.email ? file.userId.email : "Unknown",
      },
    }));
    return res.status(200).json({ files: formatted });
  } catch (error) {
    console.error("Error fetching uploaded files:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteFileById = async (req, res) => {
  try {
    const file = await upload.findByIdAndDelete(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCharts = async (req, res) => {
  try {
    const charts = await ChartHistory.find();
    const totalChartCount = charts.length;
    return res.status(200).json({ charts, totalChartCount });
  } catch (error) {
    console.error("Error fetching charts:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllInsights = async (req, res) => {
  try {
    const insights = await upload.find({ insightCount: { $gt: 0 } });
    return res.status(200).json({ insights });
  } catch (error) {
    console.error("Error fetching insights:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const userData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userInfo = await user.findById(userId).select("-password");
    if (!userInfo) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: userInfo });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const userFiles = async (req, res) => {
  try {
    const userId = req.params.userId;
    const files = await upload.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ files });
  } catch (error) {
    console.error("Error fetching user files:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const userCharts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const charts = await ChartHistory.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json({ charts });
  } catch (error) {
    console.error("Error fetching user charts:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUserById,
  getAllUploadedFiles,
  deleteFileById,
  getAllCharts,
  getAllInsights,
  userData,
  userFiles,
  userCharts,
};
