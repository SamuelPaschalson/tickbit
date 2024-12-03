const express = require("express");
const {
  signup,
  login,
  userData,
  account_info,
  change_password,
} = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
  validate,
} = require("../utils/validation");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/signup", signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.post("/create-account-info", validate, account_info);
// router.post("/create-account-info", loginValidation, validate, account_info);
// router.post("/change-password", loginValidation, validate, change_password);
router.get("/user", auth, userData);

module.exports = router;
