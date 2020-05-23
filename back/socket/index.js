function socket(io) {
	io.on('connection', () => {
		console.log('connected to socket io');
	});
}

module.exports = socket;
