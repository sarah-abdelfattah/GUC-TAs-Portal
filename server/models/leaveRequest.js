const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LeaveRequestSchema = new Schema({
  type: {
    type: String,
    required: true,
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicMember',
  },
  HOD: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicMember',
  },
  reason: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'rejected', 'pending'],
    default: 'pending',
  },
});

module.exports.LeaveRequest = mongoose.model(
  'leaveRequests',
  LeaveRequestSchema
);
