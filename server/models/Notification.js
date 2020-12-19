const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  reciever: {
    type: Schema.Types.ObjectId,
    ref: 'StaffMember',
  },
  message: {
    type: String,
    required: true,
  },
  is_seen: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Notification', NotificationSchema);
