const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");

// required models
const { AcademicMember } = require('./../models/AcademicMember');

// General Error Messages
const errorMsgs = {
  notFound: (name, id) => {
    return `There is no ${name} with id (${id})`;
  },
  notAssigned: (assignmentName, assignee) => {
    return `There are no ${assignmentName} assigned to ${assignee}`;
  },
};

// Course Instructor Controller
const courseInstructorController = {};

module.exports.courseInstructorController = courseInstructorController;
