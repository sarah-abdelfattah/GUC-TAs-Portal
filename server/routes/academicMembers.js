const express = require('express');
const router = express.Router();
// Require Controllers
const {
  courseInstructorController,
} = require('./../controllers/academicMemberController');
//const { auth } = require("../../utils/authentication");

// ==> Course Instructor Routes (Auth: Course Instructors Only) <== //
const courseInstructorBaseRoute = '/courseInstructor';

// Functionality: 29
router.get(
  `${courseInstructorBaseRoute}/courseCoverage/:instructorId`,
  courseInstructorController.courseCoverage
);

// Functionality: 30
router.get(
  `${courseInstructorBaseRoute}/slotsAssignment/:instructorId`,
  courseInstructorController.slotsAssignment
);

// Functionality: 32
router.post(
  `${courseInstructorBaseRoute}/slotsAssignment/:instructorId`,
  courseInstructorController.assignSlots
);

module.exports = router;
