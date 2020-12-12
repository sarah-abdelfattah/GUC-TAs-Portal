const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const slotRequestSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
  },
  requester: {
    type: Schema.Types.ObjectId,
    ref: 'AcademicMember',
  },
  status: {
    type: String,
    required: true,
    enum: ['accepted', 'rejected', 'pending'],
    default: 'pending',
  },
  Location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
  //TODO: edit if needed el location based 3ala el slot bt-assigned ezay
});

module.exports.SlotRequest = mongoose.model('slotRequests', slotRequestSchema);
