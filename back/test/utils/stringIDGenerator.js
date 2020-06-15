const expect = require("chai").expect;
const generateStringID = require("../../utils/stringIDGenerator");
const expectedIDLength = require("../../config/").general.stringIDLength;

describe("utils:generateStringID", function () {
	describe("Emptiness", function () {
		it(`should return ID of length ${expectedIDLength}`, function (done) {
			const generatedID = generateStringID(expectedIDLength);
			expect(generatedID).to.have.lengthOf(expectedIDLength);
			done();
		});
	});
});
