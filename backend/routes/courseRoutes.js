const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const { protect } = require("../middleware/auth");
const { validateRequest, courseRules } = require("../middleware/validate");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getCourses)
  .post(courseRules, validateRequest, createCourse);

router
  .route("/:id")
  .get(getCourse)
  .put(courseRules, validateRequest, updateCourse)
  .delete(deleteCourse);

module.exports = router;
