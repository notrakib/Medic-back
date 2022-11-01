const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

exports.postSignup = (req, res, next) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const password = req.body.password;
  const contact = req.body.contact;
  console.log(fname);

  if (password.length < 6) {
    throw Error("Password must have 6 digits");
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw Error("Email already exists");
      } else {
        return bcrypt.hash(password, 12);
      }
    })
    .then((hashedpassword) => {
      return User.create({
        fname,
        lname,
        email,
        password: hashedpassword,
        contact,
        logoutTime: 0,
        expiaryDate: 0,
        token: "",
      });
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let userInfo;

  User.findOne({ email })
    .then((exist_user) => {
      if (!exist_user) {
        throw Error("Invalid Email");
      } else {
        userInfo = {
          userId: exist_user._id,
          fname: exist_user.fname,
          lname: exist_user.lname,
          email: exist_user.email,
          logoutTime: +new Date() + 3600000,
        };
        bcrypt
          .compare(password, exist_user.password)
          .then((matched) => {
            if (matched) {
              const token = jwt.sign(userInfo, "^%)jikl$$eBE", {
                expiresIn: "1h",
              });
              return res.json({ token, userInfo });
            } else {
              throw Error("Invalid Password");
            }
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
};

exports.postForgotPassword = (req, res, next) => {
  crypto.randomBytes(12, (err, buffer) => {
    if (err) {
      throw Error(err);
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((exist_user) => {
        if (!exist_user) {
          throw Error("Email does not exist");
        } else {
          exist_user.token = token;
          exist_user.expiaryDate = +Date.now() + 3600000;
          return exist_user.save();
        }
      })
      .then(() => {
        res.json({ link: token });
      })
      .catch((err) => next(err));
  });
};

exports.postResetPassword = (req, res, next) => {
  const token = req.params.token;
  const password = req.body.password;

  User.findOne({ token, expiaryDate: { $gt: +Date.now() } })
    .then((user) => {
      if (!user) {
        throw Error("Link not valid anymore");
      } else {
        bcrypt.hash(password, 12).then((hashedpassword) => {
          user.password = hashedpassword;
          user.token = undefined;
          user.expiaryDate = undefined;
          user.save().then((result) => res.json(result));
        });
      }
    })
    .catch((err) => next(err));
};
