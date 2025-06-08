const rateLimit = require("express-rate-limit");

exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // limit each IP to 10 requests per windowMs for auth routes
  message:
    "Too many accounts created from this IP, please try again after 15 minutes",
});
