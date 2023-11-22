const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const PostSchema = new Schema({
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
  uid: { type: Schema.Types.ObjectId, ref: User, required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Post'}],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

PostSchema.virtual('likes_count').get(function() {
  return this.likes.length;
})

module.exports = mongoose.model('Post', PostSchema);