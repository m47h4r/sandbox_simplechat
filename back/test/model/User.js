const expect = require("chai").expect;
const mongoose = require("mongoose");
const { User } = require("../../models/User");
const { generateHashedPassword } = require("../../models/User");
const { checkPlainTextOverHash } = require("../../models/User");

describe("model:User", function () {
	//describe("Emptiness", function () {
	//	it("should be invalid if 'name' is empty", function (done) {
	//		const user = new User({ name: "" });
	//		user.validate("name", function (err) {
	//			expect(err.errors.name).to.exist;
	//			done();
	//		});
	//	});
	//});

	describe("Hashing", function () {
		it("should hash '123', compare it with the hash and return true", async function () {
			const hash = await generateHashedPassword('123');
			const isMatch = await checkPlainTextOverHash('123', hash);
			expect(isMatch).to.be.true;
		});
	});
});
