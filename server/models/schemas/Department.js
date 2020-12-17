const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  HOD: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
  },
  Courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = DepartmentSchema;
