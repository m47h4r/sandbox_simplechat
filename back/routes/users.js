const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require("../config/");
const generateStringID = require("../utils/stringIDGenerator");

router.post("/signup", (request, response) => {
  let user = new User({
    name: request.body.name,
    surname: request.body.surname,
    email: request.body.email,
    bio: request.body.bio,
    password: request.body.password,
    sessionSecret: generateStringID(config.general.stringIDLength),
    lastAccessed: new Date(),
  });
  user.save((error) => {
    if (error) {
      debug(error);
      // TODO: must differentiate between errors, like email taken
      response.json({ status: "failure", error: "Database error." });
    } else {
      response.json({
				status: "success",
				user: {
          name: user.name,
          surname: user.surname,
          sessionSecret: user.sessionSecret,
        }
			});
    }
  });
});

router.post("/signin", (request, response) => {
  User.findOne({ email: request.body.email }, async (error, user) => {
    if (error || !user || !user.verifyPassword(request.body.password)) {
      response.json({ status: "failure", error: "An error occured" });
    } else {
      //if (!user.isSessionValid(request.body.sessionID)) {
      const sessionSecret = generateStringID(config.general.stringIDLength);
      user.sessionSecret = sessionSecret;
      user.lastAccessed = new Date();
      await user.save();
      response.json({
        status: "success",
        user: {
          name: user.name,
          surname: user.surname,
          sessionSecret: sessionSecret,
        },
      });
      //}
    }
  });
});

router.post("/checkSession", (request, response) => {
  User.findOne(
    {
      sessionSecret: request.body.claimedSessionSecret,
    },
    async (error, user) => {
			if (!user) {
				return response.json({ result: false });
			}
			const expirationDate = new Date(
				user.lastAccessed.getTime() + (7 * 24 * 60 * 60 * 1000)
			);
			return response.json({
				result: (new Date().getTime() <= expirationDate.getTime())
			});
		}
  );
});

module.exports = router;
