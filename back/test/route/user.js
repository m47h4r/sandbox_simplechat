const supertest = require("supertest");
const express = require("express");
const sinon = require("sinon");
const { User } = require("../../models/User");
const { expect } = require("chai");
const generateStringID = require("../../utils/stringIDGenerator");
const config = require("../../config/");

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
      password: "asdf1234",
    };

    beforeEach(function () {
      sinon.stub(User.prototype, "save");
    });

    afterEach(function () {
      User.prototype.save.restore();
    });

    it("should respond with json", function (done) {
      supertest(app)
        .post("/user/signup")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err) {
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
        .end(function (err, response) {
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
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("success");
          expect(response.body.user.name).to.equal(exampleUser.name);
          expect(response.body.user.surname).to.equal(exampleUser.surname);
          done();
        });
    });
  });

  describe("POST /user/signin", function () {
    const exampleUser = {
      name: "John",
      surname: "Doe",
      email: "john@doe.com",
      password: "asdf1234",
    };

    beforeEach(function () {
      sinon.stub(User, "findOne");
      sinon.stub(User.prototype, "save");
      sinon.stub(User.prototype, "verifyPassword");
      sinon.stub(User.prototype, "createSession");
    });

    afterEach(function () {
      User.findOne.restore();
      User.prototype.save.restore();
      User.prototype.verifyPassword.restore();
      User.prototype.createSession.restore();
    });

    it("should respond with json", function (done) {
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should respond with failure if User.findOne throws exception", function (done) {
      User.findOne.throws({});
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should respond with failure if User.findOne doesn't find any user", function (done) {
      User.findOne.returns(null);
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Wrong credentials.");
          done();
        });
    });

    it("should respond with failure if User.prototype.verifyPassword throws exception", function (done) {
      User.findOne.returns(new User(exampleUser));
      User.prototype.verifyPassword.throws({});
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should respond with failure if User.prototype.verifyPassword returns false", function (done) {
      User.findOne.returns(new User(exampleUser));
      User.prototype.verifyPassword.returns(false);
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Wrong credentials.");
          done();
        });
    });

    it("should respond with failure if User.prototype.createSession throws exception", function (done) {
      User.findOne.returns(new User(exampleUser));
      User.prototype.verifyPassword.returns(true);
      User.prototype.createSession.throws({});
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should respond with failure if User.prototype.createSession returns false status", function (done) {
      User.findOne.returns(new User(exampleUser));
      User.prototype.verifyPassword.returns(true);
      User.prototype.createSession.returns({ status: false });
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("failure");
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should respond with success if all is well", function (done) {
      const sessionSecret = generateStringID(config.general.stringIDLength);
      User.findOne.returns(new User(exampleUser));
      User.prototype.verifyPassword.returns(true);
      User.prototype.createSession.returns({
        status: true,
        sessionSecret: sessionSecret,
      });
      supertest(app)
        .post("/user/signin")
        .send(exampleUser)
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.status).to.equal("success");
          expect(response.body.user.name).to.equal(exampleUser.name);
          expect(response.body.user.surname).to.equal(exampleUser.surname);
          expect(response.body.user.sessionSecret).to.equal(sessionSecret);
          done();
        });
    });
  });

  describe("POST /user/signout", function () {
    beforeEach(function () {
      sinon.stub(User, "destroySession");
    });

    afterEach(function () {
      User.destroySession.restore();
    });

    it("should respond with json", function (done) {
      supertest(app)
        .post("/user/signout")
        .send({})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });

    it("should response with false if User.destroySession throws exception", function (done) {
      User.destroySession.throws({});
      supertest(app)
        .post("/user/signout")
        .send({})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.result).to.be.false;
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should response with false if User.destroySession returns false", function (done) {
      User.destroySession.returns(false);
      supertest(app)
        .post("/user/signout")
        .send({})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.result).to.be.false;
          expect(response.body.error).to.equal("Database error occured.");
          done();
        });
    });

    it("should return success if all is well", function (done) {
      User.destroySession.returns(true);
      supertest(app)
        .post("/user/signout")
        .send({})
        .set("Accept", "application/json")
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function (err, response) {
          if (err) return done(err);
          expect(response.body.result).to.equal("success");
          done();
        });
    });
  });

  describe("POST /user/contacts/add", function () {
    beforeEach(function () {
      sinon.stub(User, "addContact");
    });

    afterEach(function () {
      User.addContact.restore();
    });

    it("should respond with json", function () {
      it("should respond with json", function (done) {
        supertest(app)
          .post("/user/contacts/add")
          .send({})
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

  describe("GET /user/contacts", function () {
    beforeEach(function () {
      sinon.stub(User, "getContacts");
    });

    afterEach(function () {
      User.getContacts.restore();
    });

    it("should respond with json", function () {
      it("should respond with json", function (done) {
        supertest(app)
          .get("/user/contacts/add")
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
});
