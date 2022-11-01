const express = require("express");
const route = express.Router();
const userController = require("../controllers/user");

route.post("/sign-up", userController.postSignup);
route.post("/sign-in", userController.postLogin);
route.post("/forgot-password", userController.postForgotPassword);
route.post("/reset-password/:token", userController.postResetPassword);

module.exports = route;
