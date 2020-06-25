const supertest = require("supertest");
const express = require("express");

const sessionRouter = require("../../routes/session");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use("/session", sessionRouter);

describe("route:session", function () {
	describe("GET /session/check", function () {
		it("should respond with json", function (done) {
			supertest(app)
				.get("/session/check")
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(200, done);
		});
	});

	describe("POST /session/update", function () {
		it("should respond with json", function (done) {
			supertest(app)
				.post("/session/update")
				.send({ claimedSessionSecret: null })
				.set("Accept", "application/json")
				.expect("Content-Type", /json/)
				.expect(200)
				.end(function (err) {
					if (err) return done(err);
					done();
				});
		});
	});
});
