const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AcademicMemberSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['teaching assistant', 'course instructor', 'course coordinator', 'HOD']
    },
    course: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

module.exports.AcademicMember = mongoose.model("academicMembers", AcademicMemberSchema);
