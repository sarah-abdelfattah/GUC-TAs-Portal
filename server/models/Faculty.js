const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const Department = require('./schemas/Department');

const FacultySchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('Faculty', FacultySchema);
