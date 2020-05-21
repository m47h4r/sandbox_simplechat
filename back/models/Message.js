const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let MessageSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: [true, "can't be blank"]
		},
		from: {
			type: Schema.Type.ObjectId,
			ref: 'User'
		},
		to: {
			type: Schema.Type.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

mongoose.model("Message", MessageSchema);
