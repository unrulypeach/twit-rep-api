const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: String,
  image: String,
  
})

module.exports = mongoose.model('Post', PostSchema)