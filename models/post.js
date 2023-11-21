const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: String,
  image: String,
  date: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Post', PostSchema)