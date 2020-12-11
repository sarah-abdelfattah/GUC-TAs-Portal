const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    courseCoordinator: {
        type: Schema.Types.ObjectId,
        ref: 'TeachingAssistant',
        required: true,
        unique: true
    },
    courseMembers: [{ // el nas el betdars el course
        type: Schema.Types.ObjectId,
        ref: 'AcademicMember',
        required: true,
        validate: v => v != null
    }],
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
