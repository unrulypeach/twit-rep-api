const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./user');
const Post = require('./post');

const LikeSchema = new Schema({
  postid: { type: Schema.Types.ObjectId, ref: Post },
  uid: { type: Schema.Types.ObjectId, ref: User},
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Like', LikeSchema);