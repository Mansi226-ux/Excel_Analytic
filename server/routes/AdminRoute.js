const express = require("express");
const auth = require("../middleware/auth.js");

const {
  getAllUsers,
  deleteUserById,
  getAllUploadedFiles,
  deleteFileById,
  getAllCharts,
  getAllInsights,
  userData,
  userFiles,
  userCharts,
} = require("../controllers/adminController.js");
const router = express.Router();

router.get("/all-users", auth, getAllUsers);
router.delete("/delete-user/:id", deleteUserById);
router.get("/all-files", auth, getAllUploadedFiles);
router.delete("/delete-file/:id", deleteFileById);
router.get("/all-charts", auth, getAllCharts);
router.get("/all-insights", auth, getAllInsights);

//get user specific data
router.get("/user/:userId", auth, userData);
router.get("/files/user/:userId", auth, userFiles);
router.get("/charts/user/:userId", auth, userCharts);

module.exports = router;
