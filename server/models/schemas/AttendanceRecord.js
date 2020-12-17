const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceRecordSchema = new Schema({
  day: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
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
  description: {
    type: String,
  },
});

module.exports = AttendanceRecordSchema;
