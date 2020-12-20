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
  `${courseInstructorBaseRoute}/courseCoverage`,
  courseInstructorController.courseCoverage
);

// Functionality: 30
router.get(
  `${courseInstructorBaseRoute}/slotsAssignment`,
  courseInstructorController.slotsAssignment
);

// Functionality: 32
router.post(
  `${courseInstructorBaseRoute}/slotsAssignment`,
  courseInstructorController.assignSlot
);

// Functionality: 33
router.put(
  `${courseInstructorBaseRoute}/slotsAssignment`,
  courseInstructorController.updateSlot
);

// Functionality: 34
router.delete(
  `${courseInstructorBaseRoute}/slotsAssignment`,
  courseInstructorController.deleteSlot
);

module.exports = router;
