const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  follow_id: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Follow', followSchema);