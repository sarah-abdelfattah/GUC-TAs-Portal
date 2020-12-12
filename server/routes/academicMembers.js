const express = require('express');
const router = express.Router();

//const { auth } = require("../../utils/authentication");
const {
  courseInstructorController,
} = require('./../controllers/academicMemberController');

// ==> Course Instructor Routes <== //
const courseInstructorBaseRoute = '/courseInstructor';

// Functionality: 29
router.get(
  `${courseInstructorBaseRoute}/coverage/:instructorId`,
  courseInstructorController.courseCoverage
);

module.exports = router;
