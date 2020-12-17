const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

// Importing needed schemas
const AttendanceRecord = require('./schemas/AttendanceRecord');
const Department = require('./schemas/Department');

const StaffMemberSchema = new Schema({
  gucId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female'],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid email format'],
  },
  password: {
    type: String,
    required: true,
    default: '123456',
  },
  dayOff: {
    type: String,
    required: true,
    default: 'Saturday',
    enum: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
  },
  salary: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['HR', 'Academic Member'],
  },
  role: {
    type: 'String',
    enum: ['Teaching Assistant', 'Course Instructor'],
  },
  leaveBalance: {
    type: Number,
    default: 0,
  },
  officeLocation: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  courses: [
    {
      course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
      roleInCourse: {
        type: 'String',
        enum: ['Teaching Assistant', 'Course Instructor', 'Course Coordinator'],
        required: true,
      },
    },
  ],
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    // required: function () {
    //   return this.type === 'Academic Member';
    // },
  },
  department: {
    type: Department,
    validate: [
      function () {
        return (
          this.faculty.departments.filter(
            (dep) => dep.name === this.department.name
          ).length > 0
        );
      },
      'This department is not found',
    ],
  },
  attendanceRecords: [AttendanceRecord],
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('StaffMember', StaffMemberSchema);
