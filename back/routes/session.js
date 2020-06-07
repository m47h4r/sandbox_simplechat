const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const debug = require("debug")("back:server");
const config = require("../config/");

router.get("/check/:session", async (request, response) => {
	const claimedSession = request.params.session;
	if (!claimedSession) {
		return response.json({ result: false });
	}
	try {
		let user = await User.findOne({
			sessionSecret: claimedSession,
		});
		if (!user) {
			return response.json({ result: false });
		}
		const expirationDate = new Date(
			user.lastAccessed.getTime() + config.general.validSessionTime
		);
		return response.json({
			result: new Date().getTime() <= expirationDate.getTime(),
		});
	} catch (e) {
		debug(e);
		response.json({ result: false });
	}
});

router.post("/update", async (request, response) => {
	try {
		let user = await User.findOne({
			sessionSecret: request.body.claimedSessionSecret
		});
		if (!user) { return response.json({ result: false }); }
			const currentDate = new Date();
			user.lastAccessed = currentDate;
			await user.save();
			return response.json({ result: true });
	} catch (e) {
		debug(e);
		response.json({ result: false });
	}
});

module.exports = router;
