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
			ref: 'User'
		},
		to: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		}
	},
	{ timestamps: true }
);

mongoose.model("Message", MessageSchema);
