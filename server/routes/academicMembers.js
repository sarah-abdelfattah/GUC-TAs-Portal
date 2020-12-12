const express = require('express');
const router = express.Router();
// Require Controllers
const {
  courseInstructorController,
} = require('./../controllers/academicMemberController');
//const { auth } = require("../../utils/authentication");

// ==> Course Instructor Routes (Course Instructors Only) <== //
const courseInstructorBaseRoute = '/courseInstructor';
// Functionality: 29
router.get(
  `${courseInstructorBaseRoute}/coverage/:instructorId`,
  courseInstructorController.courseCoverage
);

module.exports = router;
