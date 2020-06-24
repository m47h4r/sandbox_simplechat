const sinon = require("sinon");
const { User } = require("../../models/User");
const { expect } = require("chai");
const generateStringID = require("../../utils/stringIDGenerator");
const config = require("../../config/");
const {
  getUser,
  getMessages,
  generateMessageList,
  generateMessage,
  saveMessage
} = require("../../socket/message");

describe("socket:message", function () {
  describe("function:getUser", function () {
    const sessionSecret = generateStringID(config.general.stringIDLength);
    const exampleUser = new User();

    beforeEach(function () {
      sinon.stub(User, "findOne");
    });

    afterEach(function () {
      User.findOne.restore();
    });

    it("should return false if User.findOne throws exception", async function () {
      User.findOne.throws({});
      const result = await getUser(sessionSecret);
      expect(result).to.be.false;
    });

    it("should return false if User.findOne returns null", async function () {
      const mockFindOne = {
				populate: function () {
					return this;
				},
				exec: function () {
					return null;
				},
			};
			User.findOne.returns(mockFindOne);
      const result = await getUser(sessionSecret);
      expect(result).to.be.false;
    });

    it("should return true all is well", async function () {
      const mockFindOne = {
				populate: function () {
					return this;
				},
				exec: function () {
					return exampleUser;
				},
			};
			User.findOne.returns(mockFindOne);
      const result = await getUser(sessionSecret);
      expect(result).to.equal(exampleUser);
    });
  });
});
