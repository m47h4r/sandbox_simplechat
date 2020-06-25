/**
 * Express router providing user end points
 * @module routers/user
 * @requires express
 * @requires mongoose
 */

/**
 * Express module
 * @const
 */
const express = require("express");

/**
 * Express router to mount the session related functions on
 * @type {object}
 * @const
 * @namespace userRouter
 */
const router = express.Router();

/**
 * Mongoose module
 * @const
 */
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require("../config/");
const generateStringID = require("../utils/stringIDGenerator");

/**
 * Route to signup a provided user
 * @name post/user/signup
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of user being created
 */
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

/**
 * Route to signin a provided user
 * @name post/user/signin
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of user being signed in
 */
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

/**
 * Route to signout a provided user
 * @name post/user/signout
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of user being signed out
 */
router.post("/signout", async (request, response) => {
	try {
		const sessionSecret = request.body.sessionSecret;
		const isSessionDestroyed = User.destroySession(sessionSecret);
		if (isSessionDestroyed) {
			response.json({ result: "success" });
		} else {
			response.json({ result: false, error: "Database error occured." });
		}
	} catch (e) {
		debug(e);
		response.json({ result: false, error: "Database error occured." });
	}
});

/**
 * Route to add a contact to a user
 * @name post/user/contacts/add
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of contact being added
 */
router.post("/contacts/add", async (request, response) => {
	const userSession = request.body.claimedSessionSecret;
	const contactEmail = request.body.email; // TODO: must be changed to contactEmail
	const result = await User.addContact(userSession, contactEmail);
	response.json(result);
});

/**
 * Route to get contacts of a user
 * @name post/user/contacts
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of contacts being retreived
 */
router.get("/contacts", async (request, response) => {
	const claimedSession = request.headers.claimedsession;
	const result = await User.getContacts(claimedSession);
	response.json(result);
});

module.exports = router;
