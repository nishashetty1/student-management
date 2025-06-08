const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  enrollStudentInCourses,
  unenrollStudentFromCourses,
} = require("../controllers/studentController");
const { protect } = require("../middleware/auth");
const { validateRequest, studentRules } = require("../middleware/validate");
const upload = require("../utils/fileUpload");
const Student = require("../models/Student");

router.use(protect);

router
  .route("/")
  .get(getStudents)
  .post(studentRules, validateRequest, createStudent);

router
  .route("/:id")
  .get(getStudent)
  .put(studentRules, validateRequest, updateStudent)
  .delete(deleteStudent);

router.post("/:id/photo", function (req, res) {
  upload(req, res, async function (err) {
    try {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({
          success: false,
          message: err.message || "Error uploading file",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please upload a file",
        });
      }

      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({
          success: false,
          message: `No student found with id ${req.params.id}`,
        });
      }

      const updatedStudent = await Student.findByIdAndUpdate(
        req.params.id,
        { profilePicture: req.file.filename },
        { new: true }
      );

      res.status(200).json({
        success: true,
        data: updatedStudent,
      });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  });
});

router.put("/:id/enroll", enrollStudentInCourses);

router.put("/:id/unenroll", unenrollStudentFromCourses);

module.exports = router;
