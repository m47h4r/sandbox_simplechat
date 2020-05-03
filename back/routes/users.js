const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");

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
  User.findOne(
    { email: request.body.email, password: request.body.password },
    "name surname",
    (error, user) => {
			if (error) {
				debug(error);
				response.json({status: 'failure', error: 'Database error.'});
			} else {
				console.log(user);
				if (user) {
					response.json({status: 'success', user: user})
					// TODO: must sign user in using passport right here
				} else {
					response.json({status: 'failure', error: 'Wrong credentials.'});
				}
			}
		}
  );
});

module.exports = router;
