const express = require("express");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");
const auth = require("../middleware/auth.js");
const Upload = require("../models/ExcelRecord.js");
const router = express.Router();
// set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST route for file upload
router.post("/file", auth, upload.single("file"), async (req, res) => {
  try {
    const userId = req.user.id;

    const file = req.file;
    if (!file) return res.status(400).json({ error: "Please upload a file" });

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // save the data to MongoDB
    const newUpload = new Upload({
      userId,
      originalname: req.file.originalname,
      data: jsonData,
      size: req.file.size,
      createdAt: new Date(),
    });
    await newUpload.save();

    res.status(200).json({
      message: " ✅ File Save Successfully",
      uploadId: newUpload._id,
      count: jsonData.length,
    });
  } catch (err) {
    console.error("❌", err);
    res
      .status(500)
      .json({ error: "Internal Server Error while uloading file" });
  }
});

// GET record of user
router.get("/record/:id", auth, async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (!file) return res.status(404).json({ error: "File not Found" });
    res.status(200).json({
      message: "Record fetched successfully",
      data: file.data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Internal Server Error While Fetching Record" });
  }
});

// Analyze for chart
router.get("/analyze/:id", auth, async (req, res) => {
  try {
    const file = await Upload.findById(req.params.id);
    if (file || !file.data || file.data.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "No data found for analysis" });

    const data = file.data;
    const firstKey = Object.keys(data[0])[0];
    const summary = {};

    data.forEach((row) => {
      const key = row[firstKey];
      if (key !== undefined && key !== null) {
        summary[key] = (summary[key] || 0) + 1;
      }
    });

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ success: false, message: "Data analysis failed" });
  }
});

//get -- all uploads for the logged in user ?
router.get("/upload-history", auth, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(uploads);
  } catch (err) {
    console.error("❌ Fetch history error:", err);
    res.status(500).json({ error: "Server error while fetching uploads" });
  }
});
//Delete -- deletefile y id
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    const deletedFile = await Upload.findByIdAndDelete(req.params.id);
    if (!deletedFile)
      return res.status(404).json({ message: "File not found" });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
//
