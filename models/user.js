const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  userhandle: String,

  birthdate: { type: Date, required: true },
  joinedDate: { type: Date, default: Date.now },
  // authID: { type: Schema.Types.ObjectId, required: true},

  profile_pic: String,
  header_pic: String,
  bio: String,
  website: String,
  location: String,
});

module.exports = mongoose.model('User', UserSchema);