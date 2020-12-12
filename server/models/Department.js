const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  HOD: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicMember',
    required: true,
    unique: true,
  },
  Courses: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

module.exports.Department = mongoose.model('departments', DepartmentSchema);
