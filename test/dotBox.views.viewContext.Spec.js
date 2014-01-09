/*global describe, it, expect, dotBox, Observer */

describe("dotBox.views.viewContext", function () {

    var viewContext = dotBox.views.viewContext;

    describe("constructor", function () {


        it("should construct object with parameters assigned", function () {
            var target = null,
                act,
                PIXEL_RATIO = 1.3,
                observer = new Observer();

            act = function () {
                target = viewContext(observer, PIXEL_RATIO);
            };

            expect(act).not.toThrow();
            expect(target).not.toBeNull();
            expect(target.pixelRatio).toBe(PIXEL_RATIO);
            expect(target.observer).toBe(observer);


        });

        it("should not construct object without pixel ratio", function () {
            var target = null,
                act,
                observer = new Observer();

            act = function () {
                target = viewContext(observer);
            };

            expect(act).toThrow();

        });

        it("should not construct object without event dispatcher", function () {
            var target = null,
                act;

            act = function () {
                target = viewContext();
            };

            expect(act).toThrow();

        });


    });

    it("scalePixel should scale the parameter value by the pixel ratio", function () {

        var target,
            PIXEL_RATIO = 2,
            actual;

        target = viewContext(new Observer(), PIXEL_RATIO);


        actual = target.scalePixel(3);


        expect(actual).toBe(6);

    });

    it("scaleAllPixelProps should scale all pixel properties by the pixel ratio", function () {


        var target,
            PIXEL_RATIO = 2,
            pixelSet;

        pixelSet = {
            prop1: 1,
            prop2: 4
        };

        target = viewContext(new Observer(), PIXEL_RATIO);

        target.scaleAllPixelProps(pixelSet);


        expect(pixelSet.prop1).toBe(2);
        expect(pixelSet.prop2).toBe(8);


    });



    describe("setDrawColors", function () {

        var FakeColor;
        FakeColor = function (a, b) {
            this.a = a;
            this.b = b;
        };
        FakeColor.prototype.toString = function toString() {
            return this.a + this.b;
        };


        it("should assign fillStyle if only fillColor property is present on the shape", function () {

            var target,
                shape = {},
                thisTarget = {};

            target = viewContext(new Observer(), 2);

            shape.fillColor = new FakeColor("qwe", "rty");

            target.setDrawColors.apply(thisTarget, [shape]);

            expect(thisTarget.fillStyle).toBe("qwerty");


        });

        it("should assign strokeStyle if only strokeColor property is present on the shape", function () {

            var target,
                shape = {},
                thisTarget = {};

            target = viewContext(new Observer(), 2);

            shape.strokeColor = new FakeColor("qwe", "rty");

            target.setDrawColors.apply(thisTarget, [shape]);

            expect(thisTarget.strokeStyle).toBe("qwerty");


        });

        it("should assign all properties if all properties are present on the shape", function () {

            var target,
                shape = {},
                thisTarget = {};

            target = viewContext(new Observer(), 2);

            shape.fillColor = new FakeColor("qwe", "rty");
            shape.strokeColor = new FakeColor("at", "Home");

            target.setDrawColors.apply(thisTarget, [shape]);

            expect(thisTarget.fillStyle).toBe("qwerty");
            expect(thisTarget.strokeStyle).toBe("atHome");


        });


    });



});