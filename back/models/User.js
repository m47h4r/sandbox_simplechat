const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

let UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z]{2,}$/, "is invalid"],
		},
		surname: {
			type: String,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z]{2,}$/, "is invalid"],
		},
		name: { type: String, required: [true, "can't be blank"] },
		email: {
			type: String,
			lowercase: true,
			unique: true,
			required: [true, "can't be blank"],
			match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Is invalid"],
			index: true,
		},
		bio: String,
		password: String,
		sessionSecret: {
			type: String,
			require: [true, "can't be blank"],
		},
		lastAccessed: Date,
	},
	{ timestamps: true }
);

UserSchema.plugin(uniqueValidator, {
	message: "is already taken.",
});

UserSchema.methods.verifyPassword = function (password) {
	return this.password === password;
};

// not used even once, must validate when checking session for different tasks
UserSchema.methods.isSessionValid = (claimedSessionSecret) => {
	return this.sessionSecret === claimedSessionSecret;
};

mongoose.model("User", UserSchema);
