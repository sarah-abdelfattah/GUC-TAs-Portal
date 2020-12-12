const express = require('express');
const router = express.Router();

//const { auth } = require("../../utils/authentication");
const {
  courseInstructorController,
} = require('./../controllers/academicMemberController');

// ==> Course Instructor Routes <== //
const courseInstructorBaseRoute = '/academicMember/courseInstructor';

module.exports = router;
