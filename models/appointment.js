const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointment = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  stTime: Number,
  enTime: Number,
  status: String,
});

module.exports = mongoose.model("Appointment", appointment);
