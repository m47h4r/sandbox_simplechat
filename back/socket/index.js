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

const generateMessageList = (messages) => {
	let dataToReturn = [];
	for (let iterator in messages) {
		let temp = {
			_id: messages[iterator]._id,
			date: messages[iterator].createdAt,
			from: messages[iterator].from.name + " " + messages[iterator].from.surname,
			to: messages[iterator].to.name + " " + messages[iterator].to.surname,
			isSender: messages[iterator].from._id.toString() === user._id.toString(),
			text: messages[iterator].text
		}
		dataToReturn.push(temp);
	}
	return dataToReturn;
}

function socket(io) {
	io.on('connection', (socket) => {
		socket.on('get-chat-messages', async (data, cb) => {
			const user = await getUser(data.session_id);
			if (!user) { return cb({result: false, error: "Session not valid"}); }
			const messages = await getMessages(user._id, data.contact_id)
			const generatedMessageList = generateMessageList(messages);
			cb({result: true, data: generatedMessageList });
		});
	});
}

module.exports = socket;
