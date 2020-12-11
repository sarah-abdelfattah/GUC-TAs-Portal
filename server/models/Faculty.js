const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    departments: [{
        type: Schema.Types.ObjectId,
        ref: 'Department',
        validate: v => v != null
    }
    ]

})

module.exports.Faculty = mongoose.model("locations", LocationSchema);
