const expect = require("chai").expect;

const Message = require("../models/Message");

describe("model:Message", () => {
	describe("Emptiness", () => {
		it("should be invalid if 'text' is empty", (done) => {
			const message = new Message();
			message.validate((err) => {
				expect(err.errors.text).to.exist;
				done();
			});
		});
		it("should be invalid if 'from' is empty", (done) => {
			const message = new Message();
			message.validate((err) => {
				expect(err.errors.from).to.exist;
				done();
			});
		});
		it("should be invalid if 'to' is empty", (done) => {
			const message = new Message();
			message.validate((err) => {
				expect(err.errors.to).to.exist;
				done();
			});
		});
	});
});
