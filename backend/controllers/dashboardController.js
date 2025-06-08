const Student = require("../models/Student");
const Course = require("../models/Course");

// GET /api/v1/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const [studentCount, courseCount, recentStudents, allStudents] =
      await Promise.all([
        Student.countDocuments(),
        Course.countDocuments(),
        Student.find().sort("-createdAt").limit(5).populate("enrolledCourses"),
        Student.find().select("department").limit(100),
      ]);

    const departments = new Set(
      allStudents.map((student) => student.department).filter(Boolean)
    );

    res.status(200).json({
      success: true,
      data: {
        studentCount,
        courseCount,
        departmentCount: departments.size,
        recentStudents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
