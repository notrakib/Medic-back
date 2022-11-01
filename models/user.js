const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  contact: Number,
  logoutTime: Number,
  expiaryDate: Number,
  token: String,
});

module.exports = mongoose.model("User", User);
