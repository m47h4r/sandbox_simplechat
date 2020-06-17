const expect = require("chai").expect;
const mongoose = require("mongoose");
const debug = require("debug")("back:server");
const { User } = require("../../models/User");
const { generateHashedPassword } = require("../../models/User");
const { checkPlainTextOverHash } = require("../../models/User");

describe("model:User", function () {
	describe("Emptiness", function () {
		it("should be invalid if 'name' is empty", function(done) {
			const user = new User({ name: ""});
			user.validate(["name"], function(err) {
				expect(err.errors.name).to.exist;
				done();
			});
		});
		it("should be invalid if 'surname' is empty", function(done) {
			const user = new User({ surname: ""});
			user.validate(["surname"], function(err) {
				expect(err.errors.surname).to.exist;
				done();
			});
		});
		it("should be invalid if 'email' is empty", function(done) {
			const user = new User({ email: ""});
			user.validate(["email"], function(err) {
				expect(err.errors.email).to.exist;
				done();
			});
		});
		it("should be invalid if 'password' is empty", function(done) {
			const user = new User({ password: ""});
			user.validate(["password"], function(err) {
				expect(err.errors.password).to.exist;
				done();
			});
		});
	});

	describe("Hashing", function () {
		it("should hash '123', compare it with the hash and return true", async function () {
			const hash = await generateHashedPassword('123');
			const isMatch = await checkPlainTextOverHash('123', hash);
			expect(isMatch).to.be.true;
		});
	});
});
