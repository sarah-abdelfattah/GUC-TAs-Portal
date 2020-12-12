const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
  time: {
    day: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    unique: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
});

module.exports.Slot = mongoose.model('locations', SlotSchema);
