// const { handleError } = require("../utils/handleError");

// required models
const StaffMember = require('./../models/StaffMember');

// TODO: Import all the models after db connection
const Course = require('./../models/Course');

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
    try {
      const instructor = await StaffMember.findOne({
        gucId: req.params.instructorId,
        type: 'Academic Member',
        role: 'Course Instructor',
      }).populate('courses.course');

      // Case: instructor not found
      if (!instructor)
        return res.status(404).send({
          message: errorMsgs.notFound('instructor', req.params.instructorId),
        });

      // Case: instructor does not teach any courses
      if (instructor.courses.length === 0)
        return res.status(200).send({
          data: errorMsgs.notAssigned('courses', 'instructor'),
        });

      // Case: success
      return res.status(200).send({
        data: instructor.courses.map(({ course }) => {
          return {
            course_name: course.name,
            course_coverage: course.coverage,
          };
        }),
      });
    } catch (err) {
      res.status(500).send({ message: `Internal Server Error: ${err}` });
    }
  },
};

module.exports.courseInstructorController = courseInstructorController;
