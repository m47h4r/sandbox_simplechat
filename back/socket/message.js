/**
 * Socket.io module providing message socket end points
 * @module socket/message
 * @requires mongoose
 */

/**
 * Mongoose module
 * @const
 */
const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

/**
 * @function
 * @memberof module:socket/message
 * @param {string} sessionId - session id to retreive user based on it
 * @returns {boolean} false if an error occurs
 * @returns {object} user object if all is well
 */
const getUser = async (sessionId) => {
	try {
		const user = await User.findOne({ sessionSecret: sessionId }).exec();
		if (!user) {
			return false;
		}
		return user;
	} catch (e) {
		return false;
	}
};

/**
 * @function
 * @memberof module:socket/message
 * @param {string} userId - user id to get messages that include it
 * @param {string} contactId - contact id to get messages taht include it
 * @returns {boolean} false if an error occurs
 * @returns {array} Array containing message objects
 */
const getMessages = async (userId, contactId) => {
	try {
		const messages = await Message.find({
			$or: [
				{ from: userId, to: contactId },
				{ from: contactId, to: userId },
			],
		})
			.populate("from", "name surname")
			.populate("to", "name surname")
			.exec();
		if (!messages) {
			return false;
		}
		return messages;
	} catch (e) {
		return false;
	}
};

/**
 * @function
 * @memberof module:socket/message
 * @param {array} messages - array of messages to be put in list
 * @param {ObjectId} userId - current user id for generating isSender
 * @returns {array} array containing generated message list
 */
const generateMessageList = (messages, userId) => {
	let dataToReturn = [];
	for (let iterator in messages) {
		let temp = {
			_id: messages[iterator]._id,
			date: messages[iterator].createdAt,
			from:
				messages[iterator].from.name + " " + messages[iterator].from.surname,
			to: messages[iterator].to.name + " " + messages[iterator].to.surname,
			isSender: messages[iterator].from._id.toString() === userId.toString(),
			text: messages[iterator].text,
		};
		dataToReturn.push(temp);
	}
	return dataToReturn;
};

/**
 * @function
 * @memberof module:socket/message
 * @param {object} messages - message data to be generated into a proper message object
 * @returns {object} message containing generated message object
 */
const generateMessage = (message) => {
	let msg = {
		_id: message._id,
		date: message.createdAt,
		from: message.from.name + " " + message.from.surname,
		from_id: message.from._id,
		to: message.to.name + " " + message.to.surname,
		text: message.text,
	};
	return msg;
};

/**
 * @function
 * @memberof module:socket/message
 * @param {ObjectId} userId - user id sending message
 * @param {ObjectId} contactId - user id receiving message
 * @param {ObjectId} text - message text
 * @returns {object} Object.result == false if failed
 * @returns {object} Object.result == true and message object if successful
 */
const saveMessage = async (userId, contactId, text) => {
	try {
		let message = new Message({
			from: userId,
			to: contactId,
			text: text,
		});
		let saved_message = await message.save();
		let msg = await Message.findOne({ _id: saved_message._id })
			.populate("from", "name surname")
			.populate("to", "name surname")
			.exec();
		return { result: true, message: msg };
	} catch (e) {
		return { result: false };
	}
};

function message(io) {
	io.on("connection", (socket) => {
		socket.on("get-chat-messages", async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) {
				return cb({ result: false, error: "Session not valid" });
			}
			const messages = await getMessages(user._id, data.contact_id);
			const generatedMessageList = generateMessageList(messages, user._id);
			cb({ result: true, data: generatedMessageList });
		});

		socket.on("send-message", async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) {
				return cb({ result: false, error: "Session not valid" });
			}
			const res = await saveMessage(user._id, data.contact_id, data.message);
			if (!res.result) {
				return cb({ result: false, error: "Database error" });
			} else {
				cb({ result: true });
				const message = generateMessage(res.message);
				io.emit("new-message", { message: message });
			}
		});

		socket.on("check-is-user-sender", async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) {
				return cb({ result: false, error: "Session not valid" });
			}
			return cb({ result: user._id.toString() === data.from.toString() });
		});
	});
}

module.exports = {
	message,
	getUser,
	getMessages,
	generateMessageList,
	generateMessage,
	saveMessage,
};
