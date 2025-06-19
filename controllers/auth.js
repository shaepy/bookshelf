const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");

router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up", {
    userExists: false,
    invalidPassword: false,
    passwordTooShort: false,
  });
});

router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in", {
    loginError: false,
  });
});

router.get("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

router.post("/sign-up", async (req, res) => {
  const existingUser = await User.findOne({ username: req.body.username });
  if (existingUser) {
    return res.render("auth/sign-up", {
      userExists: true,
      invalidPassword: false,
      passwordTooShort: false,
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    return res.render("auth/sign-up", {
      userExists: false,
      invalidPassword: true,
      passwordTooShort: false,
    });
  }
  if (req.body.password.length < 8) {
    return res.render("auth/sign-up", {
      userExists: false,
      invalidPassword: false,
      passwordTooShort: true,
    });
  }

  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const newUser = await User.create(req.body);

  req.session.user = {
    username: newUser.username,
    _id: newUser._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

router.post("/sign-in", async (req, res) => {
  const validUser = await User.findOne({ username: req.body.username });
  if (!validUser) return res.render("auth/sign-in", { loginError: true });

  const validPassword = bcrypt.compareSync(
    req.body.password,
    validUser.password
  );
  if (!validPassword) return res.render("auth/sign-in", { loginError: true });

  req.session.user = {
    username: validUser.username,
    _id: validUser._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

module.exports = router;