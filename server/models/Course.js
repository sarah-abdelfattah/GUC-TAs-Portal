const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseCoordinator: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
    required: true,
    unique: true,
    validate: [
      (v) => v.type === 'Academic Member' && v.role === 'Teaching Assistant',
      'Course Coordinator can only be a Teaching Assistant',
    ],
  },
  numberOfSlots: {
    type: Number,
    required: true,
  },
  coverage: {
    type: Number,
    default: 0,
  },

  // ! We don't to keep track of course members since it can be none. Each member will have an array called courses
  // courseMembers: {
  //   instructors: [
  //     {
  //       //instructors
  //       type: Schema.Types.ObjectId,
  //       ref: 'AcademicMember',
  //       required: true,
  //       validate: (v) => v != null && v.type === 'course instructor',
  //     },
  //   ],
  //   teachingAssistant: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: 'AcademicMember',
  //       required: true,
  //       validate: (v) => v != null && v.type === 'teaching assistant',
  //     },
  //   ],
  // },
});

module.exports = mongoose.model('Course', CourseSchema);
