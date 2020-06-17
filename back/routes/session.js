const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

router.get("/check", async (request, response) => {
	const claimedSession = request.headers.claimedsession;
	const isSessionValid = await User.checkSession(claimedSession);
	response.json({ result: isSessionValid });
});

router.post("/update", async (request, response) => {
	const claimedSession = request.body.claimedSessionSecret;
	const isSessionUpdated = await User.updateSession(claimedSession);
	response.json({ result: isSessionUpdated });
});

module.exports = router;
