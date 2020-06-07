const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require("../config/");
const generateStringID = require("../utils/stringIDGenerator");

const createNewUser = (credentials) => {
	return new User({
		name: credentials.name,
		surname: credentials.surname,
		email: credentials.email,
		bio: credentials.bio,
		password: credentials.password,
		sessionSecret: generateStringID(config.general.stringIDLength),
		lastAccessed: new Date(),
	});
};

const createSessionAndUpdateDB = async (user) => {
	try {
		const sessionSecret = generateStringID(config.general.stringIDLength);
		user.sessionSecret = sessionSecret;
		user.lastAccessed = new Date();
		await user.save();
		return { status: true, sessionSecret: sessionSecret };
	} catch (e) {
		debug(e);
		return { status: false };
	}
};

router.post("/signup", async (request, response) => {
	let newUser = createNewUser({
		name: request.body.name,
		surname: request.body.surname,
		email: request.body.email,
		bio: request.body.bio,
		password: request.body.password,
	});
	try {
		await newUser.save();
		response.json({
			status: "success",
			user: {
				name: newUser.name,
				surname: newUser.surname,
				sessionSecret: newUser.sessionSecret,
			},
		});
	} catch (e) {
		debug(e);
		response.json({ status: "failure", error: "Database error occured." });
	}
});

router.post("/signin", async (request, response) => {
	try {
		let user = await User.findOne({ email: request.body.email });
		if (!user) {
			return response.json({ status: "failure", error: "Wrong credentials." });
		}
		const isPasswordVerified = await user.verifyPassword(request.body.password);
		if (!isPasswordVerified) {
			return response.json({ status: "failure", error: "Wrong credentials." });
		}
		const sessionCreationResult = await createSessionAndUpdateDB(user);
		if (!sessionCreationResult.status) {
			return response.json({
				status: "failure",
				error: "Database error occured.",
			});
		}
		response.json({
			status: "success",
			user: {
				name: user.name,
				surname: user.surname,
				sessionSecret: sessionCreationResult.sessionSecret,
			},
		});
	} catch (e) {
		debug(e);
		response.json({ status: "failure", error: "Database error occured." });
	}
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
	User.findOne({ sessionSecret: request.body.claimedSessionSecret })
		.populate("contacts", "name surname")
		.exec(async (error, user) => {
			if (!user || error) {
				return response.json({ result: false, error: "An error occured" });
			}
			return response.json({ result: true, contactList: user.contacts });
		});
});

module.exports = router;
