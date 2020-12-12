const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const academicMembers = require("./AcademicMember");

// Create the schema
const StaffMemberSchema = new Schema({
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
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
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
        type: {
            type: String,
            required: true,
            enum: ['tutorial room', 'lecture hall', 'office', 'lab']
        },
        location: {
            type: String,
            required: true,
        },
        capacity: {
            type: Number,
        },
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
    aType: {
        type: String,
        enum: ['teaching assistant', 'course instructor', 'course coordinator', 'HOD']
    },
    course: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

module.exports.StaffMember = mongoose.model("staffMembers", StaffMemberSchema);
