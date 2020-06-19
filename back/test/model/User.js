const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
const debug = require("debug")("back:server");
const config = require("../../config/");
const { User } = require("../../models/User");
const { generateHashedPassword } = require("../../models/User");
const { checkPlainTextOverHash } = require("../../models/User");
const expectedIDLength = require("../../config/").general.stringIDLength;
const generateStringID = require("../../utils/stringIDGenerator");

describe("model:User", function () {
	describe("Emptiness", function () {
		it("should be invalid if 'name' is empty", function (done) {
			const user = new User({ name: "" });
			user.validate(["name"], function (err) {
				expect(err.errors.name).to.exist;
				done();
			});
		});
		it("should be invalid if 'surname' is empty", function (done) {
			const user = new User({ surname: "" });
			user.validate(["surname"], function (err) {
				expect(err.errors.surname).to.exist;
				done();
			});
		});
		it("should be invalid if 'email' is empty", function (done) {
			const user = new User({ email: "" });
			user.validate(["email"], function (err) {
				expect(err.errors.email).to.exist;
				done();
			});
		});
		it("should be invalid if 'password' is empty", function (done) {
			const user = new User({ password: "" });
			user.validate(["password"], function (err) {
				expect(err.errors.password).to.exist;
				done();
			});
		});
	});

	describe("Hashing", function () {
		it("should hash '123', compare it with the hash and return true", async function () {
			const hash = await generateHashedPassword("123");
			const isMatch = await checkPlainTextOverHash("123", hash);
			expect(isMatch).to.be.true;
		});
	});

	describe("method:createSession", function () {
		it(`should return true status and sessionSecret of length ${expectedIDLength}`, async function() {
			const stub = sinon.stub(User.prototype, 'save');
			let user = new User();
			const result = await user.createSession();
			stub.restore();
			expect(result.status).to.be.true;
			expect(result.sessionSecret.length).to.equal(expectedIDLength);
		});
	});

	describe("method:destroySession", function() {
		it("should be called with a sessionSecret", async function() {
			const stub_save = sinon.stub(User.prototype, 'save');
			const stub_findOne = sinon.stub(User, 'findOne');
			const sessionSecret = generateStringID(config.general.stringIDLength);
			await User.destroySession(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
			stub_save.restore();
			stub_findOne.restore();
		});
		it("should return true", async function() {
			const stub_save = sinon.stub(User.prototype, 'save');
			const sessionSecret = generateStringID(config.general.stringIDLength);
			const stub_findOne = sinon.stub(User, 'findOne').returns(new User({
				sessionSecret: sessionSecret,
				lastAccessed: new Date()
			}));
			const result = await User.destroySession(sessionSecret);
			expect(result).to.be.true;
			stub_save.restore();
			stub_findOne.restore();
		});
	});

	describe("method:checkSession", function() {
		it("should return false if no session is provided", async function() {
			const stub_findOne = sinon.stub(User, 'findOne');
			const result = await User.checkSession(null);
			expect(result).to.be.false;
			stub_findOne.restore();
		});
		it("should return false if no user is found", async function() {
			const stub_findOne = sinon.stub(User, 'findOne').returns(null);
			const sessionSecret = generateStringID(config.general.stringIDLength);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.false;
			stub_findOne.restore();
		});
		it("should be called with a sessionSecret", async function() {
			const stub_findOne = sinon.stub(User, 'findOne');
			const sessionSecret = generateStringID(config.general.stringIDLength);
			await User.checkSession(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
			stub_findOne.restore();
		});
		it("should return false if lastAccessed is greater than expiration date", async function() {
			const stub_findOne = sinon.stub(User, 'findOne').returns(new User({
				// this makes sure the expiration date will always be at least
				// one millisecond (if bot `new Date()`s are executed at the same time)
				// less than the current date date
				lastAccessed: new Date().getTime() - config.general.validSessionTime - 1
			}));
			const sessionSecret = generateStringID(config.general.stringIDLength);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.false;
			stub_findOne.restore();
		});
		it("should return true if lastAccessed is less than expiration date", async function() {
			const stub_findOne = sinon.stub(User, 'findOne').returns(new User({
				lastAccessed: new Date().getTime()
			}));
			const sessionSecret = generateStringID(config.general.stringIDLength);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.true;
			stub_findOne.restore();
		});
	});
});
