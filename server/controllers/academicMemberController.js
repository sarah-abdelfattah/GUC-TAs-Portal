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
const courseInstructorController = {
  // ==> Functionality 29 <== //
  async courseCoverage(req, res) {
    const instructor = await AcademicMember.find({
      gucId: req.params.instructorId,
      type: 'Course Instructor',
    });

    // Case: instructor not found
    if (instructor.length === 0)
      res
        .status(404)
        .send(errorMsgs.notFound('instructor', req.params.instructorId));
    // Case: instructor does not teach any courses
    else if (instructor[0].course.length === 0)
      res.status(200).send(errorMsgs.notAssigned('courses', 'instructor'));
    // Case: success
    else
      res.status(200).send(
        instructor[0].course.map(({ name, coverage }) => {
          return {
            course_name: name,
            course_coverage: coverage,
          };
        })
      );
  },
};

module.exports.courseInstructorController = courseInstructorController;
