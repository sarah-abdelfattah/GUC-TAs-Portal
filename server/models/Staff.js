const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academicMembers = require("./AcademicMember.js");

// Create the schema
const StaffSchema = new Schema({
    GUCID: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female']
    },
    email: {
        type: email,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        default: "123456"
    },
    daysOff: {
        type: String,
        required: true,
        default: "Saturday"
    },
    salary: {
        type: Number,
        required: true
    },
    officeLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
    attendanceRecord: [{
        type: Schema.Types.ObjectId,
        ref: 'Attendance'
    }],
    type: {
        type: String,
        required: true,
        enum: ['HR', 'Academic Member']
    },
    leaveBalance: {
        type: Number,
        default: 0
    },
    children: [
        academicMembers
    ],
})

module.exports.Staff = mongoose.model("staffs", StaffSchema);
