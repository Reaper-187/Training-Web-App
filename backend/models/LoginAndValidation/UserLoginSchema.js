const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, required: false },
  verificationToken: { type: String, required: false },
  tokenExpires: { type: Date, required: false },
  createdOn: { type: Date, default: Date.now },
  resetCode: { type: Number },
  resetCodeExpires: { type: Date },
});

module.exports = mongoose.model('User', userSchema);