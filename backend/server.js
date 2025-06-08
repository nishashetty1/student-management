const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const { limiter, authLimiter } = require("./middleware/rateLimit");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Load env vars
dotenv.config({ path: "./.env" });

// Connect to database
connectDB();

// Route files
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "https://student-management-frontend-ynbe.onrender.com"],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json());
app.use("/api/v1/auth", authLimiter);
app.use(limiter);
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/api/v1/dashboard", dashboardRoutes);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Mount routers
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/courses", courseRoutes);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
