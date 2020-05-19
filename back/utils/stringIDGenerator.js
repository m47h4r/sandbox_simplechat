const generateStringID = (stringLength) => {
	let randomString = "";
	const chars =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charsLength = chars.length;
	for (let i = 0; i < stringLength; i++) {
		randomString += chars.charAt(Math.floor(Math.random() * charsLength));
	}
	return randomString;
};

module.exports = generateStringID;
