const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Represents a message in database.
 * @class MessageSchema
 * @property {string} text - Text of the message
 * @property {Schema.Types.ObjectId} from - ObjectId of the sender
 * @property {Schema.Types.ObjectId} to - ObjectId of the receiver
 */
let MessageSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, "can't be blank"],
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "can't be blank"],
		},
		to: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: [true, "can't be blank"],
		},
	},
	{ timestamps: true }
);

module.exports = {
	Message: mongoose.model("Message", MessageSchema),
};
