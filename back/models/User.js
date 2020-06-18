const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const config = require("../config/");
const debug = require("debug")("back:server");
const generateStringID = require("../utils/stringIDGenerator");

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

// TODO: write tests for this
UserSchema.methods.createSession = async function () {
	try {
		const sessionSecret = generateStringID(config.general.stringIDLength);
		this.sessionSecret = sessionSecret;
		await this.save();
		return { status: true, sessionSecret: sessionSecret };
	} catch (e) {
		debug(e);
		return { status: false };
	}
};

// TODO: write tests for this
UserSchema.statics.destroySession = async function (sessionSecret) {
	try {
		const user = await mongoose
			.model("User")
			.findOne({ sessionSecret: sessionSecret });
		if (!user) {
			return false;
		}
		user.sessionSecret = null;
		user.lastAccessed = new Date();
		await user.save();
		return true;
	} catch (e) {
		debug(e);
		return false;
	}
};

// TODO: must write tests for this
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

// TODO: must write tests for this
UserSchema.statics.updateSession = async function (claimedSession) {
	try {
		let user = await mongoose
			.model("User")
			.findOne({ sessionSecret: claimedSession });
		if (!user) {
			return false;
		}
		user.lastAccessed = new Date();
		await user.save();
		return true;
	} catch (e) {
		debug(e);
		return false;
	}
};

// TODO: write tests for this
UserSchema.statics.addContact = async function (userSession, contactEmail) {
	try {
		const user = await mongoose.model("User").findOne({
			sessionSecret: userSession
		});
		if (!user) {
			return { result: false, error: "Invalid session." };
		}
		const contact = await mongoose.model("User").findOne({
			email: contactEmail
		});
		user.contacts.push(contact._id);
		await user.save();
		return { result: true };
	} catch (e) {
		debug(e);
		return { result: false, error: "An error occured." };
	}
};

module.exports = {
	User: mongoose.model("User", UserSchema),
	generateHashedPassword: generateHashedPassword,
	checkPlainTextOverHash: checkPlainTextOverHash,
};
