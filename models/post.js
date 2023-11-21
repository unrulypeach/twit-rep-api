const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

/* const PostSchema = new Schema({
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  uid: { type: Schema.Types.ObjectId, ref: User, required: true },
  postid: Schema.Types.ObjectId, // id of post being replied to
  level: { type: Number, default: 0 }, // ?? not sure how to implement this, how to add number to replies
}); */

const PostSchema = new Schema({
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  uid: { type: Schema.Types.ObjectId, ref: User, required: true },
  comments: [ Schema.Types.ObjectId ],
});
module.exports = mongoose.model('Post', PostSchema);