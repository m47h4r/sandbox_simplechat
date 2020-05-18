module.exports = {
	general: {
		stringIDLength: 20,
		validSessionTime: (7 * 24 * 60 * 60 * 1000)
	},
  db: {
    uri: "mongodb://localhost:27017/securechat",
  },
	session: {
		secret: "supersecret",
	}
};
