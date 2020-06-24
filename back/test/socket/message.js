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
  getChatMessages,
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
        },
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
        },
      };
      Message.find.returns(mockFind);
      const result = await getMessages();
      expect(result).to.equal(exampleMessage);
    });
  });

  describe("function:generateMessageList", function () {
    const senderID = 0;
    const messages = [
      {
        _id: 0,
        createdAt: new Date(),
        from: { _id: 0, name: "Sender", surname: "Senderi" },
        to: { _id: 1, name: "Receiver", surname: "Receiveri" },
        text: "Some text",
      },
      {
        _id: 1,
        createdAt: new Date(),
        from: { _id: 1, name: "Receiver", surname: "Receiveri" },
        to: { _id: 0, name: "Sender", surname: "Senderi" },
        text: "Some other text",
      },
    ];

    const responseMessage = [
      {
        _id: messages[0]._id,
        date: messages[0].createdAt,
        from: messages[0].from.name + " " + messages[0].from.surname,
        to: messages[0].to.name + " " + messages[0].to.surname,
        isSender: messages[0].from._id.toString() === senderID.toString(),
        text: messages[0].text,
      },
      {
        _id: messages[1]._id,
        date: messages[1].createdAt,
        from: messages[1].from.name + " " + messages[1].from.surname,
        to: messages[1].to.name + " " + messages[1].to.surname,
        isSender: messages[1].from._id.toString() === senderID.toString(),
        text: messages[1].text,
      },
    ];

    it("should return an array containing a specefic type of objects", function () {
      const result = generateMessageList(messages, senderID);
      expect(result).to.deep.equal(responseMessage);
    });
  });

  describe("function:generateMessage", function () {
    const message = {
      _id: 0,
      createdAt: new Date(),
      from: { _id: 0, name: "Sender", surname: "Senderi" },
      to: { _id: 1, name: "Receiver", surname: "Receiveri" },
      text: "Some text",
    };

    const responseMessage = {
      _id: message._id,
      date: message.createdAt,
      from: message.from.name + " " + message.from.surname,
      from_id: message.from._id,
      to: message.to.name + " " + message.to.surname,
      text: message.text,
    };

    it("should return a specefic type of object", function () {
      const result = generateMessage(message);
      expect(result).to.deep.equal(responseMessage);
    });
  });
});
