const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isLoggedIn: {
    type: Boolean,
    default: false
  },
  token: {
    type: String,
    default: null
  },
  otp: {
    type: String,
    default: null
  },
  otpExp: {
    type: Date,
    default: null
  },
}, { timestamps: true });

const UserModel = model("User", UserSchema)

module.exports = UserModel