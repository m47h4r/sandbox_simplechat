const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const config = require("../config/");
const debug = require("debug")("back:server");

const SALT_WORK_FACTOR = config.passwd.bcrypt_salt_work_factor;

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
		password: {
			type: String,
			required: [true, "can't be blank"],
		},
		sessionSecret: {
			type: String,
			required: [true, "can't be blank"],
		},
		lastAccessed: Date,
		contacts: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{ timestamps: true }
);

async function generateHashedPassword(plainTextPassword) {
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		const hash = await bcrypt.hash(plainTextPassword, salt);
		return hash;
	} catch (e) {
		debug(e);
	}
}

async function checkPlainTextOverHash(plainText, hash) {
	return await bcrypt.compare(plainText, hash);
}

UserSchema.pre("save", async function (next) {
	const user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) return next();

	const hashedPassword = await generateHashedPassword(user.password);
	user.password = hashedPassword;
	next();
});

UserSchema.methods.verifyPassword = async function (claimedPassword) {
	return await checkPlainTextOverHash(claimedPassword, this.password);
};

UserSchema.statics.checkSession = async function (claimedSession) {
	try {
		if (!claimedSession) {
			return false;
		}
		const user = await mongoose
			.model("User")
			.findOne({ sessionSecret: claimedSession });
		if (!user) {
			return false;
		}
		const expirationDate = new Date(
			user.lastAccessed.getTime() + config.general.validSessionTime
		);
		return new Date().getTime() <= expirationDate.getTime();
	} catch (e) {
		debug(e);
		return false;
	}
};

module.exports = {
	User: mongoose.model("User", UserSchema),
	generateHashedPassword: generateHashedPassword,
	checkPlainTextOverHash: checkPlainTextOverHash,
};
