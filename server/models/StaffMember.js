const mongoose = require('mongoose');
const { isEmail } = require('validator');
const Schema = mongoose.Schema;

// Importing needed schemas
const AttendanceRecord = require('./schemas/AttendanceRecord');

const StaffMemberSchema = new Schema({
    gucId: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female'],
    },
    email: {
        type: String, // There is not type called email, So we will validate on the value
        required: true,
        unique: true,
        validate: [isEmail, 'Invalid email format'], // Instead of using regex validations, We used validator library to handle this
    },
    password: {
        type: String,
        required: true,
        default: '123456',
    },
    dayOff: {
        type: String,
        required: true,
        default: 'Saturday',
    },
    salary: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['HR', 'Academic Member'],
    },
    role: {
        type: 'String',
        enum: [
            'Teaching Assistant',
            'Course Instructor',
            'Course Coordinator',
            'HOD',
        ],
    },
    leaveBalance: {
        type: Number,
        default: 0,
    },
    officeLocation: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    courses: [
        {
            course: {
                type: Schema.Types.ObjectId,
                ref: 'Course',
            },
            slots: [
                {
                    day: {
                        type: String,
                        enum: [
                            'Saturday',
                            'Sunday',
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                        ],
                    },
                    time: Date,
                    location: {
                        type: Schema.Types.ObjectId,
                        ref: 'Location',
                    },
                },
            ],
            roleInCourse: {
                type: 'String',
                enum: ['Teaching Assistant', 'Course Instructor', 'Course Coordinator'],
                required: true,
            },
        },
    ],
    attendanceRecords: [AttendanceRecord],
    is_deleted: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('StaffMember', StaffMemberSchema);
