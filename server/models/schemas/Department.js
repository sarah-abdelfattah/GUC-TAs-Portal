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
    required: true,
    unique: true,
    validate: (v) => v.type === 'Academic Member',
  },
  Courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

module.exports = DepartmentSchema;
