const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

const getUser = async (sessionId) => {
	try {
		const user = await User.findOne({sessionSecret: sessionId }).exec();
		if (!user) { return false }
		return user;
	} catch (e) {
		return false;
	}
}

const getMessages = async (userId, contactId) => {
	try {
		const messages = await Message.find(
			{ $or: [
				{ from: userId, to: contactId },
				{ from: contactId, to: userId }
			]}
		)
		.populate('from', 'name surname')
		.populate('to', 'name surname')
		.exec();
		if (!messages) { return false; }
		return messages;
	} catch (e) {
		return false;
	}
}

const generateMessageList = (messages, userId) => {
	let dataToReturn = [];
	for (let iterator in messages) {
		let temp = {
			_id: messages[iterator]._id,
			date: messages[iterator].createdAt,
			from: messages[iterator].from.name + " " + messages[iterator].from.surname,
			to: messages[iterator].to.name + " " + messages[iterator].to.surname,
			isSender: messages[iterator].from._id.toString() === userId.toString(),
			text: messages[iterator].text
		}
		dataToReturn.push(temp);
	}
	return dataToReturn;
}

const saveMessage = async (userId, contactId, text) => {
	try {
		let message = new Message({
			from: userId,
			to: contactId,
			text: text
		});
		let saved_message = await message.save();
		console.log(saved_message)
		return { result: true, message_id: saved_message._id };
	} catch(e) {
		return { result: false };
	}
}

function socket(io) {
	io.on('connection', (socket) => {
		socket.on('get-chat-messages', async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) { return cb({result: false, error: "Session not valid"}); }
			const messages = await getMessages(user._id, data.contact_id)
			const generatedMessageList = generateMessageList(messages, user._id);
			cb({result: true, data: generatedMessageList });
		});

		socket.on('send-message', async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) { return cb({result: false, error: "Session not valid"}); }
			const res = await saveMessage(user._id, data.contact_id, data.message);
			if (!res.result) { return cb({result: false, error: "Database error"}); }
			else { return cb({result: true, message_id: res.message_id}); }
		});
	});
}

module.exports = socket;
