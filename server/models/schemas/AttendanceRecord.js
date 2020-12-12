const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceRecordSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      'Present',
      'Absent',
      'Annual Leave',
      'Accidental Leave',
      'Sick Leave',
      'Maternity Leave',
      'Compensation Leave',
    ],
  },
});

module.exports = AttendanceRecordSchema;
