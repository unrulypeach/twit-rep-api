const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({
  uid: { type: Schema.Types.ObjectId, ref: 'User' },
  followid: { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Follow', followSchema);