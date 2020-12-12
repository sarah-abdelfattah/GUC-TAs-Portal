const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
    type: {
        type: String,
        required: true,
        enum: ['tutorial room', 'lecture hall', 'office', 'lab']
    },
    location: {
        type: String,
        required: true,
        unique: true
    },
    capacity: {
        type: Number,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
})

module.exports = Location = mongoose.model("locations", LocationSchema);


//NOT NEEDED