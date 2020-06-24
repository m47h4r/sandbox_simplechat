const sinon = require("sinon");
const { User } = require("../../models/User");
const { Message } = require("../../models/Message");
const { expect } = require("chai");
const generateStringID = require("../../utils/stringIDGenerator");
const config = require("../../config/");
const {
  getUser,
  getMessages,
  generateMessageList,
  generateMessage,
  saveMessage,
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

    it("should return object all is well", async function () {
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

  describe("function:getMessages", function () {
    const exampleMessage = new Message();

    beforeEach(function () {
      sinon.stub(Message, "find");
    });

    afterEach(function () {
      Message.find.restore();
    });

    it("should return false if Message.find throws exception", async function () {
      Message.find.throws({});
      const result = await getMessages();
      expect(result).to.be.false;
    });

    it("should return false if Message.find returns null", async function () {
      const mockFind = {
        populate: function () {
          return this;
        },
        exec: function () {
          return null;
        }
      };
      Message.find.returns(mockFind);
      const result = await getMessages();
      expect(result).to.be.false;
    });

    it("should return object if all is well", async function () {
      const mockFind = {
        populate: function () {
          return this;
        },
        exec: function () {
          return exampleMessage;
        }
      };
      Message.find.returns(mockFind);
      const result = await getMessages();
      expect(result).to.equal(exampleMessage);
    });
  });
});
