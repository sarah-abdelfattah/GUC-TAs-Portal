const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    courseCoordinator: {
        type: Schema.Types.ObjectId,
        ref: 'AcademicMember',
        required: true,
        unique: true,
        validate: v => v.type === 'teaching assistant'

    },
    courseMembers: {
        instructors: [{ //instructors
            type: Schema.Types.ObjectId,
            ref: 'AcademicMember',
            required: true,
            validate: v => v != null && v.type === 'course instructor'
        }],
        teachingAssistant: [{
            type: Schema.Types.ObjectId,
            ref: 'AcademicMember',
            required: true,
            validate: v => v != null && v.type === 'teaching assistant'
        }]
    },
    numberOfSlots: {
        type: Number,
        required = true,
    },
    coverage: {
        type: Number,
        default: 0
    }
})

module.exports.Course = mongoose.model("courses", CourseSchema);
