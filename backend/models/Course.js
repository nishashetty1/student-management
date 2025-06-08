const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    credits: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", CourseSchema);
