const Appointment = require("../models/appointment");
const User = require("../models/user");

exports.createAppointment = (req, res, next) => {
  const stTime = +req.body.stTime;
  const enTime = stTime + 1200000;
  const status = "Pending";
  const userId = req.user.userId;

  if (
    new Date(+req.body.stTime - 21600000).getHours() < 8 ||
    new Date(+req.body.stTime - 21600000).getHours() > 20
  ) {
    throw Error("Please select from 8:00am to 8:40pm");
  }

  Appointment.findOne({
    $and: [{ stTime: { $lte: stTime } }, { enTime: { $gte: stTime } }],
  })
    .then((result) => {
      if (result) {
        throw Error("Time conflicts");
      } else {
        return Appointment.create({ stTime, enTime, status, userId });
      }
    })
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.fetchOneAppointment = (req, res, next) => {
  const _id = req.params.id;

  Appointment.findById({ _id })
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.fetchAllAppointment = (req, res, next) => {
  const userId = req.user.userId;
  const offset = +req.params.offset * 4 || 0;

  Appointment.find({ userId })
    .limit(4)
    .skip(offset)
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.DeleteAppointment = (req, res, next) => {
  const _id = req.params.id;

  Appointment.findByIdAndDelete({ _id })
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.listOfAppointment = (req, res, next) => {
  const offset = +req.params.offset * 4 || 0;

  Appointment.find()
    .limit(4)
    .skip(offset)
    .populate("userId")
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.filteredByName = (req, res, next) => {
  const fname = req.params.fname;
  const lname = req.params.lname;

  User.findOne({ fname, lname })
    .then((user) => {
      if (user) {
        return Appointment.find({ userId: user._id }).populate("userId");
      } else {
        res.json([]);
      }
    })
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.filteredById = (req, res, next) => {
  const _id = req.params.appointmentId;

  Appointment.findById({ _id })
    .populate("userId")
    .then((result) => res.json([result]))
    .catch((err) => next(err));
};

exports.filteredByTime = (req, res, next) => {
  const stTime = +req.params.stTime + 21600000;
  const enTime = +req.params.enTime + 21600000;

  Appointment.find({
    $and: [{ stTime: { $gte: stTime } }, { stTime: { $lte: enTime } }],
  })
    .populate("userId")
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.filteredByStatus = (req, res, next) => {
  const status = req.params.status;

  Appointment.find({ status })
    .populate("userId")
    .then((result) => res.json(result))
    .catch((err) => next(err));
};

exports.changeScedule = (req, res, next) => {
  const _id = req.params.appointmentId;
  const stTime = req.body.stTime;
  const status = req.body.status;
  const enTime = stTime + 1200000;

  if (
    (new Date(+req.body.stTime - 21600000).getHours() < 8 && stTime != null) ||
    (new Date(+req.body.stTime - 21600000).getHours() > 20 && enTime != null)
  ) {
    throw Error("Please select from 8:00am to 8:40pm");
  }

  Appointment.findOne({
    $and: [{ stTime: { $lte: stTime } }, { enTime: { $gte: stTime } }],
  })
    .then((appoint) => {
      if (appoint) {
        throw Error("Time conflicts");
      } else {
        return Appointment.findById({ _id });
      }
    })
    .then((appointment) => {
      appointment.stTime = stTime === null ? appointment.stTime : stTime;
      appointment.enTime = stTime === null ? appointment.enTime : enTime;
      appointment.status = status;
      return appointment.save();
    })
    .then((result) => res.json(result))
    .catch((err) => next(err));
};
