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
				},
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

router.post("/signout", (request, response) => {
	User.findOne(
		{ sessionSecret: request.body.sessionSecret },
		async (error, user) => {
			if (!user) {
				return response.json({
					result: false,
					error: "No such session found!",
				});
			}
			user.sessionSecret = null;
			user.lastAccessed = new Date();
			await user.save();
			return response.json({ status: "success" });
		}
	);
});

router.post("/checkSession", (request, response) => {
	if (!request.body.claimedSessionSecret) {
		return response.json({ result: false });
	}
	User.findOne(
		{ sessionSecret: request.body.claimedSessionSecret },
		async (error, user) => {
			if (!user || error) {
				return response.json({ result: false });
			}
			const expirationDate = new Date(
				user.lastAccessed.getTime() + config.general.validSessionTime
			);
			return response.json({
				result: new Date().getTime() <= expirationDate.getTime(),
			});
		}
	);
});

router.post("/updateSessionTime", (request, response) => {
	User.findOne(
		{ sessionSecret: request.body.claimedSessionSecret },
		async (error, user) => {
			if (!user || error) {
				return response.json({ result: false });
			}
			const currentDate = new Date();
			user.lastAccessed = currentDate;
			await user.save();
			return response.json({ result: true });
		}
	);
});

router.post("/addContact", (request, response) => {
	User.findOne(
		{ sessionSecret: request.body.claimedSessionSecret },
		async (errorSession, user) => {
			if (!user || errorSession) {
				return response.json({ result: false, error: "An error occured." });
			}
			User.findOne(
				{ email: request.body.email },
				async (errorContact, contact) => {
					if (!contact || errorContact) {
						return response.json({ result: false, error: "User not found." });
					}
					user.contacts.push(contact._id);
					await user.save();
					return response.json({ result: true });
				}
			);
		}
	);
});

router.post("/getContactList", (request, response) => {
	User.findOne(
		{ sessionSecret: request.body.claimedSessionSecret })
		.populate('contacts', 'name surname')
		.exec(async (error, user) => {
			if (!user || error) {
				return response.json({ result: false, error: "An error occured" });
			}
			return response.json({ result: true, contactList: user.contacts });
		}
	);
});

module.exports = router;
