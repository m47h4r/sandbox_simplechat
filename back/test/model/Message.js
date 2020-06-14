const expect = require("chai").expect;
const mongoose = require("mongoose");
const Message = require("../../models/Message");

describe("model:Message", function () {
	describe("Emptiness", function () {
		it("should be invalid if 'text' is empty", function (done) {
			const message = new Message({ text: "" });
			message.validate((err) => {
				expect(err.errors.text).to.exist;
				done();
			});
		});
		it("should be invalid if 'from' is empty", function (done) {
			const message = new Message({ from: "" });
			message.validate((err) => {
				expect(err.errors.from).to.exist;
				done();
			});
		});
		it("should be invalid if 'to' is empty", function (done) {
			const message = new Message({ to: "" });
			message.validate((err) => {
				expect(err.errors.to).to.exist;
				done();
			});
		});
	});
});
