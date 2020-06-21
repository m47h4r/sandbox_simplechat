const expect = require("chai").expect;
const sinon = require("sinon");
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
		beforeEach(function () {
			sinon.stub(User.prototype, "save");
		});

		afterEach(function () {
			User.prototype.save.restore();
		});

		it(`should return true status and sessionSecret of length ${expectedIDLength}`, async function () {
			let user = new User();
			const result = await user.createSession();
			expect(result.status).to.be.true;
			expect(result.sessionSecret.length).to.equal(expectedIDLength);
		});

		it("should return false status when User throws error", async function () {
			User.prototype.save.throws({});
			let user = new User();
			const result = await user.createSession();
			expect(result.status).to.be.false;
		});
	});

	describe("method:destroySession", function () {
		const sessionSecret = generateStringID(config.general.stringIDLength);

		beforeEach(function () {
			sinon.stub(User.prototype, "save");
			sinon.stub(User, "findOne").returns(
				new User({
					sessionSecret: sessionSecret,
					lastAccessed: new Date(),
				})
			);
		});

		afterEach(function () {
			User.prototype.save.restore();
			User.findOne.restore();
		});

		it("should be called with a sessionSecret", async function () {
			await User.destroySession(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
		});

		it("should return true", async function () {
			const result = await User.destroySession(sessionSecret);
			expect(result).to.be.true;
		});

		it("should return false if User.findOne throws exception", async function () {
			User.findOne.throws({});
			const result = await User.destroySession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should return false if User.prototype.save throws exception", async function () {
			User.prototype.save.throws({});
			const result = await User.destroySession(sessionSecret);
			expect(result).to.be.false;
		});
	});

	describe("method:checkSession", function () {
		const sessionSecret = generateStringID(config.general.stringIDLength);

		beforeEach(function () {
			sinon.stub(User, "findOne");
		});

		afterEach(function () {
			User.findOne.restore();
		});

		it("should return false if no session is provided", async function () {
			const result = await User.checkSession(null);
			expect(result).to.be.false;
		});

		it("should return false if no user is found", async function () {
			User.findOne.returns(null);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should be called with a sessionSecret", async function () {
			await User.checkSession(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
		});

		it("should return false if lastAccessed is greater than expiration date", async function () {
			User.findOne.returns(
				new User({
					// this makes sure the expiration date will always be at least
					// one millisecond (if bot `new Date()`s are executed at the same time)
					// less than the current date date
					lastAccessed:
						new Date().getTime() - config.general.validSessionTime - 1,
				})
			);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should return true if lastAccessed is less than expiration date", async function () {
			User.findOne.returns(
				new User({
					lastAccessed: new Date().getTime(),
				})
			);
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.true;
		});

		it("should return false if User.findOne throws exception", async function () {
			User.findOne.throws({});
			const result = await User.checkSession(sessionSecret);
			expect(result).to.be.false;
		});
	});

	describe("method:updateSession", function () {
		const sessionSecret = generateStringID(config.general.stringIDLength);

		beforeEach(function () {
			sinon.stub(User.prototype, "save");
			sinon.stub(User, "findOne");
		});

		afterEach(function () {
			User.prototype.save.restore();
			User.findOne.restore();
		});

		it("should be called with a sessionSecret", async function () {
			await User.updateSession(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
		});

		it("should return false if sessionSecret is falsy", async function () {
			const sessionSecret = null;
			const result = await User.updateSession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should return false if no user is found", async function () {
			User.findOne.returns(null);
			const result = await User.updateSession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should return true if user is found", async function () {
			User.findOne.returns(
				new User({
					lastAccessed: new Date(),
				})
			);
			const result = await User.updateSession(sessionSecret);
			expect(result).to.be.true;
		});

		it("should return false if User.findOne throws exception", async function () {
			User.findOne.throws({});
			const result = await User.updateSession(sessionSecret);
			expect(result).to.be.false;
		});

		it("should return false if User.prototype.save throws exception", async function () {
			User.prototype.save.throws({});
			const result = await User.updateSession(sessionSecret);
			expect(result).to.be.false;
		});
	});

	describe("method:addContact", function () {
		const sessionSecret = generateStringID(config.general.stringIDLength);
		const email = "example@mail.com";

		beforeEach(function () {
			sinon.stub(User.prototype, "save");
			sinon.stub(User, "findOne");
		});

		afterEach(function () {
			User.prototype.save.restore();
			User.findOne.restore();
		});

		it("should return false and the correct error if no user is found", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.returns(null);
			User.findOne
				.withArgs({
					email: email,
				})
				.returns(new User());
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("Invalid session.");
		});

		it("should return false and the correct error if no contact is found", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.returns(new User());
			User.findOne
				.withArgs({
					email: email,
				})
				.returns(null);
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("Invalid contact.");
		});

		it("should return true if no problem occurs", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.returns(new User());
			User.findOne
				.withArgs({
					email: email,
				})
				.returns(new User({ contacts: [] }));
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.true;
		});

		it("should return false and the correct error if User.findOne(user) throws exception", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.throws({});
			User.findOne
				.withArgs({
					email: email,
				})
				.returns(new User({ contacts: [] }));
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("An error occured.");
		});

		it("should return false and the correct error if User.findOne(contact) throws exception", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.returns(new User());
			User.findOne
				.withArgs({
					email: email,
				})
				.throws({});
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("An error occured.");
		});

		it("should return false and the correct error if User.prototype.save() throws exception", async function () {
			User.findOne
				.withArgs({
					sessionSecret: sessionSecret,
				})
				.returns(new User());
			User.findOne
				.withArgs({
					email: email,
				})
				.returns(new User({ contacts: [] }));
			User.prototype.save.throws({});
			const result = await User.addContact(sessionSecret, email);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("An error occured.");
		});
	});

	describe("method:getContacts", function () {
		const sessionSecret = generateStringID(config.general.stringIDLength);

		beforeEach(function () {
			sinon.stub(User, "findOne");
		});

		afterEach(function () {
			User.findOne.restore();
		});

		it("should be called with a sessionSecret", async function () {
			await User.getContacts(sessionSecret);
			sinon.assert.calledWith(User.findOne, { sessionSecret: sessionSecret });
		});

		it("should return false and the correct error if no user is found", async function () {
			const mockFindOne = {
				populate: function () {
					return this;
				},
				exec: function () {
					return null;
				},
			};
			User.findOne.returns(mockFindOne);
			const result = await User.getContacts(sessionSecret);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("Invalid session.");
		});

		it("should return true and contactList if all is well", async function () {
			const mockFindOne = {
				populate: function () {
					return this;
				},
				exec: function () {
					return {
						contacts: [],
					};
				},
			};
			User.findOne.returns(mockFindOne);
			const result = await User.getContacts(sessionSecret);
			expect(result.result).to.be.true;
			expect(result.contactList).to.be.an("array");
		});

		it("should return false and the correct error if User.findOne() throws exception", async function () {
			User.findOne.throws({});
			const result = await User.getContacts(sessionSecret);
			expect(result.result).to.be.false;
			expect(result.error).to.equal("Database error occured.");
		});
	});
});
