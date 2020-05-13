const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require('../config/');
const generateStringID = require('../utils/stringIDGenerator');

/* GET users listing. */
//router.get("/", (request, res, next) => {
//  res.send("respond with a resource");
//});

router.post("/signup", (request, response) => {
  let user = new User({
    name: request.body.name,
    surname: request.body.surname,
    email: request.body.email,
    bio: request.body.bio,
    password: request.body.password,
		sessionSecret: generateStringID(config.general.stringIDLength),
		lastAccessed: new Date
  });
  user.save((error) => {
    if (error) {
      debug(error);
      // TODO: must differentiate between errors, like email taken
      response.json({ status: "failure", error: "Database error." });
    } else {
      response.json({ status: "success", error: "" });
    }
  });
});

router.post("/signin", (request, response) => {
  User.findOne({ email: request.body.email }, async (error, user) => {
    if (error || !user || !user.verifyPassword(request.body.password)) {
      response.json({ status: "failure", error: "An error occured" });
    } else {
      //if (!user.isSessionValid(request.body.sessionID)) {
				user.sessionSecret = generateStringID(config.general.stringIDLength);
				user.lastAccessed = new Date();
				await user.save();
        response.json({ status: "success", user: user });
      //}
    }
  });
  //User.findOne(
  //  { email: request.body.email, password: request.body.password },
  //  "name surname",
  //  (error, user) => {
  //    if (error) {
  //      debug(error);
  //      response.json({ status: "failure", error: "Database error." });
  //    } else {
  //      console.log(user);
  //      if (user) {
  //        response.json({ status: "success", user: user });
  //				passport.authenticate('local', (request, response) => {
  //					response
  //				})
  //        // TODO: must sign user in using passport right here
  //      } else {
  //        response.json({ status: "failure", error: "Wrong credentials." });
  //      }
  //    }
  //  }
  //);
});

module.exports = router;
