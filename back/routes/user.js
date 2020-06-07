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

router.post("/signout", async (request, response) => {
	try {
		let user = await User.findOne({
			sessionSecret: request.body.sessionSecret,
		});
		if (!user) {
			return response.json({ result: false, error: "Session not found." });
		}
		user.sessionSecret = null;
		user.lastAccessed = new Date();
		await user.save();
		return response.json({ status: "success" });
	} catch (e) {
		debug(e);
		response.json({ result: false, error: "Database error occured." });
	}
});

router.post("/contacts/add", async (request, response) => {
	try {
		let user = await User.findOne({
			sessionSecret: request.body.claimedSessionSecret,
		});
		if (!user) {
			return response.json({ result: false, error: "An error occured." });
		}
		let contact = await User.findOne({ email: request.body.email });
		if (!contact) {
			return response.json({ result: false, error: "User not found." });
		}
		user.contacts.push(contact._id);
		await user.save();
		return response.json({ result: true });
	} catch (e) {
		debug(e);
		response.json({ result: false, error: "An error occured." });
	}
});

router.get("/contacts/:session", async (request, response) => {
	const claimedSession = request.params.session;
	try {
		let user = await User.findOne({ sessionSecret: claimedSession })
			.populate("contacts", "name surname")
			.exec();
		if (!user) {
			return response.json({ result: false, error: "Invalid session." });
		}
		response.json({ result: true, contactList: user.contacts });
	} catch (e) {
		debug(e);
		response.json({ result: false, error: "Database error occured." });
	}
});

module.exports = router;
