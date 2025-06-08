const express = require("express");
const { register, login } = require("../controllers/authController");
const {
  validateRequest,
  registerRules,
  loginRules,
} = require("../middleware/validate");

const router = express.Router();

router.post("/register", registerRules, validateRequest, register);
router.post("/login", loginRules, validateRequest, login);

module.exports = router;
