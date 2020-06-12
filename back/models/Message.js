const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, "can't be blank"]
		},
		from: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, "can't be blank"]
		},
		to: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: [true, "can't be blank"]
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
