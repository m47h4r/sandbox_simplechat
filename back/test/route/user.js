const supertest = require("supertest");
const express = require("express");
const sinon = require("sinon");
const { User } = require("../../models/User");
const { expect } = require("chai");

const userRouter = require("../../routes/user");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/user", userRouter);

describe("route:user", function () {
	describe("POST /user/signup", function () {
		const exampleUser = {
			name: "John",
			surname: "Doe",
			email: "john@doe.com",
			password: "asdf1234"
		};

		beforeEach(function () {
			sinon.stub(User.prototype, "save");
			sinon.stub(User.prototype, "constructor");
		});
		
		afterEach(function () {
			User.prototype.save.restore();
			User.prototype.constructor.restore();
		})

		it("should respond with json", function (done) {
			supertest(app)
				.post("/user/signup")
				.send(exampleUser)
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(200)
				.end(function(err) {
					if (err) return done(err);
					done();
				});
		});

		it("should respond with failure if User.prototype.save throws exception", function (done) {
			User.prototype.save.throws({});
			supertest(app)
				.post("/user/signup")
				.send(exampleUser)
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body.status).to.equal("failure");
					expect(response.body.error).to.equal("Database error occured.");
					done();
				});
		});

		it("should respond with success if all is well", function (done) {
			supertest(app)
				.post("/user/signup")
				.send(exampleUser)
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(200)
				.end(function(err, response) {
					if (err) return done(err);
					expect(response.body.status).to.equal("success");
					expect(response.body.user.name).to.equal(exampleUser.name);
					expect(response.body.user.surname).to.equal(exampleUser.surname);
					done();
				});
		});
	});
});
