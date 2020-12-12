const ObjectId = require('mongoose').Types.ObjectId;
// const { handleError } = require("../utils/handleError");

// required models
const StaffMember = require('./../models/StaffMember');

// General Error Messages
const errorMsgs = {
  notFound: (name, id) => {
    return `There is no ${name} with id (${id})`;
  },
  notAssigned: (assignmentName, assignee) => {
    return `There are no ${assignmentName} assigned to this ${assignee}`;
  },
};

// Course Instructor Controller
const courseInstructorController = {
  // ==> Functionality 29 <== //
  async courseCoverage(req, res) {
    const instructor = await StaffMember.findOne({
      gucId: req.params.instructorId,
      type: 'Academic Member',
      role: 'Course Instructor',
    }).populate('courses.course');
    // Case: instructor not found
    if (instructor.length === 0)
      res
        .status(404)
        .send(errorMsgs.notFound('instructor', req.params.instructorId));
    // Case: instructor does not teach any courses
    else if (instructor.courses.length === 0)
      res.status(200).send(errorMsgs.notAssigned('courses', 'instructor'));
    // Case: success
    else
      res.status(200).send(
        instructor.courses.map(({ course }) => {
          return {
            course_name: course.name,
            course_coverage: course.coverage,
          };
        })
      );
  },
};

module.exports.courseInstructorController = courseInstructorController;
