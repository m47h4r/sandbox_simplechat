const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

let UserSchema = new mongoose.Schema({
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
	name: {type: String, required: [true, "can't be blank"]},
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: [true, "can't be blank"],
		match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Is invalid"],
		index: true
	},
	bio: String,
	pass: String,
}, {timestamps: true});

UserSchema.plugin(uniqueValidator, {
	message: 'is already taken.'
});

UserSchema.methods.verifyPassword = (password) => {
	return this.pass === password;
};

mongoose.model('User', UserSchema);
