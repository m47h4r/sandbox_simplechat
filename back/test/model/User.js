const expect = require("chai").expect;
const mongoose = require("mongoose");
const User = require("../../models/User");

describe("model:User", function () {
	describe("Emptiness", function () {
		it("should be invalid if 'name' is empty", function (done) {
			const user = new User({ name: "" });
			user.validate('name', function (err) {
				expect(err.errors.name).to.exist;
				done();
			});
		});
	});
});
