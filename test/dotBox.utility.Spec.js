/*global describe, it, expect, dotBox */


describe("dotBox.utility", function () {

    it("isNullOrUndefined should return true if value is undefined", function () {

        var value = undefined,
            actual;


        actual = dotBox.utility.isNullOrUndefined(value);

        expect(actual).toBe(true);



        actual = dotBox.utility.isNullOrUndefined();
        expect(actual).toBe(true);


    });

    it("isNullOrUndefined should return true if value is null", function () {


        var value = null,
            actual;


        actual = dotBox.utility.isNullOrUndefined(value);

        expect(actual).toBe(true);


    });

    it("isNullOrUndefined should return false if value is not null and not undefined", function () {

        var value,
            actual;


        value = "hello"
        actual = dotBox.utility.isNullOrUndefined(value);
        expect(actual).toBe(false);


        value = 1.24
        actual = dotBox.utility.isNullOrUndefined(value);
        expect(actual).toBe(false);


        value = {}
        actual = dotBox.utility.isNullOrUndefined(value);
        expect(actual).toBe(false);


    });


});