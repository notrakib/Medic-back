const userRoute = require("./routes/user");
const appointmentRoute = require("./routes/appointment");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(userRoute);
app.use(appointmentRoute);

app.use((error, req, res, next) => {
  res.json({ error: { message: error.message } });
});

mongoose
  .connect("mongodb+srv://rakib:rakib@cluster0.f4fx5.mongodb.net/appointment")
  .then(() => app.listen(process.env.PORT || 8080))
  // .then(() => app.listen(8080))
  .catch((err) => console.log(err));
