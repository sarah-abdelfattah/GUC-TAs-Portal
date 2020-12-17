const mongoose = require('mongoose');
const Schema = mongoose.Schema;
<<<<<<< HEAD

const Department = require('./schemas/Department');

=======
const Department = require('./schemas/Department');
>>>>>>> 1e63b003725414970d49e095bf05e8bd9a3a60aa
const FacultySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  departments: [Department],
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Faculty', FacultySchema);
