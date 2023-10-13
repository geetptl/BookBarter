describe("Array", function () {
    it("# length should return 3", function () {
        expect([1, 2, 3].length).toBe(3);
    });

    describe("#indexOf()", function () {
        it("# should return first present index", function () {
            expect([1, 2, 3, 1].indexOf(1)).toBe(0);
        });

        it("should return -1 since the value is not present", function () {
            expect([1, 2, 3, 1].indexOf(4)).toBe(-1);
        });
    });
});
