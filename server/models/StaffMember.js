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
    type: String, // There is not type called email, So we will validate on the value
    required: true,
    unique: true,
    validate: [isEmail, 'Invalid email format'], // Instead of using regex validations, We used validator library to handle this
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
  department: Department,
  // department: {
  //   type: Department,
  //   unique: false,

  // TODO: Handle the validation of dapartment in the faculty
  // validate: (v) => {
  //   return (
  //     v.faculty.departments.filter((dep) => dep.name === v.department.name)
  //       .length > 0
  //   );
  // },
  // },
  attendanceRecords: [AttendanceRecord],
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('StaffMember', StaffMemberSchema);
