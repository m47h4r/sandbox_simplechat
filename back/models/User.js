const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const config = require("../config/");

const SALT = config.passwd.bcrypt_salt_work_factor;

let UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z\s-]{3,}$/, "is invalid"],
		},
		surname: {
			type: String,
			required: [true, "can't be blank"],
			match: [/^[a-zA-Z\s-]{3,}$/, "is invalid"],
		},
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
			required: [true, "can't be blank"],
		},
		lastAccessed: Date,
		contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

UserSchema.pre("save", function (next) {
	const user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	bcrypt.genSalt(SALT, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

UserSchema.plugin(uniqueValidator, {
	message: "is already taken.",
});

UserSchema.methods.verifyPassword = async function (claimedPassword) {
	const match = await bcrypt.compare(claimedPassword, this.password);
	return match;
};

module.exports = mongoose.model("User", UserSchema);
