const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveRequestSchema = new Schema({
    type: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['accepted', 'rejected', 'pending'],
        default: 'pending'
    }
})

module.exports.LeaveRequest = mongoose.model("leaveRequests", leaveRequestSchema);
