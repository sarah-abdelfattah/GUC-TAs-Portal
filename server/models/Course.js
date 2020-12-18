const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Slot = require('./schemas/Slot');

const CourseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  courseCoordinator: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  slots: [Slot],
  coverage: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Course', CourseSchema);
