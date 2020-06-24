const mongoose = require("mongoose");
const Message = mongoose.model("Message");
const User = mongoose.model("User");
const debug = require("debug")("back:server");

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

const getChatMessages = async function (data, cb) {
  try {
    const user = await getUser(data.session_id);
    if (!user) {
      return cb({ result: false, error: "Session not valid" });
    }
    const messages = await getMessages(user._id, data.contact_id);
    const generatedMessageList = generateMessageList(messages, user._id);
    cb({ result: true, data: generatedMessageList });
  } catch(e) {
    debug(e);
    cb({ result: false });
  }
};

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
    socket.on("get-chat-messages", getChatMessages);
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
  getChatMessages,
  generateMessageList,
  generateMessage,
  saveMessage,
};
