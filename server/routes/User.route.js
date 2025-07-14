//all authentication end points
const express = require("express");
const { body } = require("express-validator");
const {
  registerAction,
  logInAction,
  logOutAction,
  forgotPassword,
  createNewPassword,
  deleteAccount,
} = require("../controllers/User.controller.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

router.post(
  "/register",
  body("name", "Name is required").notEmpty(),
  body("email", "Email is required").notEmpty().isEmail(),
  body("password", "Password must contain at least 6 letter")
    .notEmpty()
    .isLength({ min: 6 }),
  body("role", "Role is Required").notEmpty(),
  body("timestamp", "Timestamp is required").notEmpty().isISO8601(),
  registerAction
);

router.post("/login", logInAction);
router.post("/logout", logOutAction);
router.post("/forgot-password", forgotPassword);
router.post("/create-new-password", createNewPassword);
router.delete("/delete-account/:id", auth, deleteAccount);

module.exports = router;
