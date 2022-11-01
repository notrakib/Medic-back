const express = require("express");
const route = express.Router();
const appointmentController = require("../controllers/appointment");
const isAuth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");

//Patient
route.post(
  "/post-appointment",
  isAuth,
  appointmentController.createAppointment
);
route.get(
  "/get-appointment/:id",
  isAuth,
  appointmentController.fetchOneAppointment
);
route.get(
  "/get-all-appointment/:offset",
  isAuth,
  appointmentController.fetchAllAppointment
);
route.delete(
  "/delete-appointment/:id",
  isAuth,
  appointmentController.DeleteAppointment
);

//Admin
route.get(
  "/list-of-appointment/:offset",
  isAdmin,
  appointmentController.listOfAppointment
);
route.get(
  "/name-filter/:fname/:lname",
  isAdmin,
  appointmentController.filteredByName
);
route.get(
  "/id-filter/:appointmentId",
  isAdmin,
  appointmentController.filteredById
);
route.get(
  "/time-filter/:stTime/:enTime",
  isAdmin,
  appointmentController.filteredByTime
);
route.get(
  "/status-filter/:status",
  isAdmin,
  appointmentController.filteredByStatus
);

route.post(
  "/change-schedule/:appointmentId",
  isAdmin,
  appointmentController.changeScedule
);

module.exports = route;
