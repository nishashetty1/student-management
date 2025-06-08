const { validationResult, body } = require("express-validator");

// Validation error handler
exports.validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Student validation rules
exports.studentRules = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("age").optional().isInt().withMessage("Age must be a number"),
  body("department")
    .optional()
    .isString()
    .withMessage("Department must be a string"),
];

// Course validation rules
exports.courseRules = [
  body("title").not().isEmpty().withMessage("Title is required"),
  body("credits").optional().isInt().withMessage("Credits must be a number"),
];

// Auth validation rules
exports.registerRules = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

exports.loginRules = [
  body("email").isEmail().withMessage("Please include a valid email"),
  body("password").exists().withMessage("Password is required"),
];
