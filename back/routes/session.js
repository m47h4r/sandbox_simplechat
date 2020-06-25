/**
 * Express router providing session end points
 * @module routers/session
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
 * @namespace sessionRouter
 */
const router = express.Router();

/**
 * Mongoose module
 * @const
 */
const mongoose = require("mongoose");
const User = mongoose.model("User");

/**
 * Route to check session
 * @name get/session/check
 * @function
 * @memberof module:routers/session~sessionRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware
 * @returns {json} - Status of session being valid or not
 */
router.get("/check", async (request, response) => {
	const claimedSession = request.headers.claimedsession;
	const isSessionValid = await User.checkSession(claimedSession);
	response.json({ result: isSessionValid });
});

/**
 * Route to update session
 * @name post/session/update
 * @function
 * @memberof module:routers/session~sessionRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 * @returns {json} - Status of session being updated
 */
router.post("/update", async (request, response) => {
	const claimedSession = request.body.claimedSessionSecret;
	const isSessionUpdated = await User.updateSession(claimedSession);
	response.json({ result: isSessionUpdated });
});

module.exports = router;
