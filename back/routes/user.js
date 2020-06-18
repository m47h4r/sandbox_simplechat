const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require("../config/");
const generateStringID = require("../utils/stringIDGenerator");

router.post("/signup", async (request, response) => {
	const newUser = new User({
		name: request.body.name,
		surname: request.body.surname,
		email: request.body.email,
		bio: request.body.bio,
		password: request.body.password,
		sessionSecret: generateStringID(config.general.stringIDLength),
		lastAccessed: new Date(),
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
		const sessionCreationResult = await user.createSession();
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

router.post("/signout", async (request, response) => {
	try {
		const sessionSecret = request.body.sessionSecret;
		const isSessionDestroyed = User.destroySession(sessionSecret);
		if (isSessionDestroyed) {
			response.json({ status: "success" });
		} else {
			response.json({ result: false, error: "Database error occured." });
		}
	} catch (e) {
		debug(e);
		response.json({ result: false, error: "Database error occured." });
	}
});

router.post("/contacts/add", async (request, response) => {
	const userSession = request.body.claimedSessionSecret;
	const contactEmail = request.body.email; // TODO: must be changed to contactEmail
	const result = await User.addContact(userSession, contactEmail);
	response.json(result);
});

router.get("/contacts", async (request, response) => {
	const claimedSession = request.headers.claimedsession;
	const result = await User.getContacts(claimedSession);
	response.json(result);
});

module.exports = router;
