const Student = require("../models/Student");

// GET /api/v1/students
exports.getStudents = async (req, res) => {
  try {
    let query;

    const reqQuery = { ...req.query };

    const removeFields = ["page", "limit"];

    removeFields.forEach((param) => delete reqQuery[param]);

    if (req.query.department) {
      reqQuery.department = { $regex: req.query.department, $options: "i" };
    }

    query = Student.find(reqQuery).populate("enrolledCourses");

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Student.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const students = await query;

    const pagination = {};
    pagination.page = page;
    pagination.limit = limit;
    pagination.total = total;

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: students.length,
      pagination,
      data: students,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/v1/students/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate(
      "enrolledCourses"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// POST /api/v1/students
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/students/:id
exports.updateStudent = async (req, res) => {
  try {
    console.log("Received update data:", req.body); // Debug line

    if (req.body.enrolledCourses) {
      req.body.enrolledCourses = req.body.enrolledCourses.filter((id) => id);
    }

    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`,
      });
    }

    const populatedStudent = await Student.findById(student._id).populate(
      "enrolledCourses"
    );

    res.status(200).json({
      success: true,
      data: populatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/v1/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/students/:id/enroll
exports.enrollStudentInCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`,
      });
    }

    const newCourses = courseIds.filter(
      (courseId) => !student.enrolledCourses.includes(courseId)
    );

    student.enrolledCourses.push(...newCourses);
    await student.save();

    const updatedStudent = await Student.findById(req.params.id).populate(
      "enrolledCourses"
    );

    res.status(200).json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/v1/students/:id/unenroll
exports.unenrollStudentFromCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: `No student found with id ${req.params.id}`,
      });
    }
    student.enrolledCourses = student.enrolledCourses.filter(
      (courseId) => !courseIds.includes(courseId.toString())
    );

    await student.save();

    const updatedStudent = await Student.findById(req.params.id).populate(
      "enrolledCourses"
    );

    res.status(200).json({
      success: true,
      data: updatedStudent,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
