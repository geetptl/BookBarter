const assert = require("node:assert/strict");

describe("Array", function () {
  describe("#length", function () {
    it("should return 3", function () {
      assert.equal([1, 2, 3].length, 3);
    });
  });

  describe("#indexOf()", function () {
    it("should return -1 since the value is not present", function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
