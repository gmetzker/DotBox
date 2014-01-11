/*global describe, it, expect, dotBox */


describe("dotBox.utility", function () {

    var util = dotBox.utility;

    describe("isNullOrUndefined", function () {

        it("should return true if value is undefined", function () {

            //noinspection JSHint,JSLint
            var value = undefined,
                actual;


            actual = dotBox.utility.isNullOrUndefined(value);

            expect(actual).toBe(true);



            actual = dotBox.utility.isNullOrUndefined();
            expect(actual).toBe(true);


        });

        it("should return true if value is null", function () {


            var value = null,
                actual;


            actual = dotBox.utility.isNullOrUndefined(value);

            expect(actual).toBe(true);


        });

        it("should return false if value is not null and not undefined", function () {

            var value,
                actual;

            value = "hello";
            actual = dotBox.utility.isNullOrUndefined(value);
            expect(actual).toBe(false);

            value = 1.24;
            actual = dotBox.utility.isNullOrUndefined(value);
            expect(actual).toBe(false);

            value = {};
            actual = dotBox.utility.isNullOrUndefined(value);
            expect(actual).toBe(false);


        });

    });

    describe("areSameDot", function () {

        it("should return true when both x and y coordinates of both dots match up", function () {

            var dot1 = {x: 1, y: 3},
                dot2 = {x: 1, y: 3},
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(true);

            result = util.areSameDot(dot2, dot1);
            expect(result).toBe(true);


        });

        it("should return true when both dots are null", function () {

            var dot1 = null,
                dot2 = null,
                result;

            result = util.areSameDot(dot1, dot2);

            expect(result).toBe(true);

        });

        it("should return false when only x differs", function () {

            var dot1 = {x: 1.1, y: 3},
                dot2 = {x: 1, y: 3},
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(false);

            result = util.areSameDot(dot2, dot1);
            expect(result).toBe(false);


        });

        it("should return false when only y differs", function () {

            var dot1 = {x: 1, y: 3},
                dot2 = {x: 1, y: 5},
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(false);

            result = util.areSameDot(dot2, dot1);
            expect(result).toBe(false);


        });

        it("should return false when both x and y differ", function () {

            var dot1 = {x: 4, y: 3},
                dot2 = {x: 1, y: 3.2},
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(false);

            result = util.areSameDot(dot2, dot1);
            expect(result).toBe(false);


        });

        it("should return false when dot1 is null and dot2 is not", function () {

            var dot1 = null,
                dot2 = {x: 1, y: 3},
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(false);




        });

        it("should return false when dot2 is null and dot1 is not", function () {

            var dot1 = {x: 1, y: 3},
                dot2 = null,
                result;


            result = util.areSameDot(dot1, dot2);
            expect(result).toBe(false);
        });


    });

});