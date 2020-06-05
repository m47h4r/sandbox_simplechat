const message = require("./message");

function socket(io) {
	message(io);
}

module.exports = socket;
