const userService = require("../services/user");

describe("userService", () => {
    describe("#validateUserId()", () => {
        it("# pass for correct ids", () => {
            expect(userService.validateUserId(1212)).toBeTrue();
        });

        it("# fail for incorrect ids", () => {
            expect(userService.validateUserId("abcd")).toBeFalse();
            expect(userService.validateUserId("123abcd")).toBeFalse();
        });
    });
});
