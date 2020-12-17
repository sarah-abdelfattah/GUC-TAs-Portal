const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  departments: [Department],
  is_deleted: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model('Faculty', FacultySchema);
