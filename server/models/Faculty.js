const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FacultySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  departments: [Department],
});

module.exports = mongoose.model('Faculty', FacultySchema);
