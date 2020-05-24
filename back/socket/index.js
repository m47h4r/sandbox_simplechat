// const User = require("../models/User")
// const Message = require("../models/Message");
const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

function socket(io) {
	io.on('connection', (socket) => {
		// let m = new Message({
			// text: "Hi how are you?",
			// from: "5ec8d706ec3b56fb87cd2ad0",
			// to: "5ec8d8b8ec3b56fb87cd2ad1"
		// })
		// m.save();
		socket.on('get-chat-messages', (data, cb) => {
			User.findOne(
				{ sessionSecret: data.session_id },
				(error, user) => {
					if (!user || error) {
						cb({result: false, error: "Session not valid"});
						// socket.emit('return-chat-messages',
							// { 
								// result: false,
								// error: "User session is not valid"
							// }
						// );
					}
					Message.find(
						{ $or: [
							{ from: user._id, to: data.contact_id },
							{ from: data.contact_id, to: user._id}
							]
						})
						.populate('from', 'name surname')
						.populate('to', 'name surname')
						.exec((error, messages) => {
							if (!messages || error) {
								cb({result: false, error: "Session not valid"});
								// socket.emit('return-chat-messages',
									// { 
										// result: false,
										// error: "User session is not valid"
									// }
								// );
							}
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
							cb({result: true, data: dataToReturn});
							// socket.emit('return-chat-messages',
								// {
									// result: true,
									// data: message
								// }
							// );
						}
					);
				}
			);
		});
	});
}

module.exports = socket;
