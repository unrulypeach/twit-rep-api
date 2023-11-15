const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuthSchema = new Schema({
  username: { type: String , required: true },
  hash: String,
  salt: String
});

module.exports = mongoose.model('Auth', AuthSchema);