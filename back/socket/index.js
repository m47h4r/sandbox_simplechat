const message = require("./message");

function socket(io) {
	message.message(io);
}

module.exports = socket;
