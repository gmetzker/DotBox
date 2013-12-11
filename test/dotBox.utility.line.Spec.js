/*global describe, it, expect, dotBox */

describe("dotBox.utility.line", function () {

    var lineUtil = dotBox.utility.line;

    it("isHLine should return true when there is a change on the x-axis", function () {

        var line = {};

        line = {
            d1: {x: 0, y: 0},
            d2: {x: 1, y: 0}
        }

        expect(lineUtil.isHLine(line)).toBe(true);



        line = {
            d1: {x: 2, y: 1},
            d2: {x: 0, y: 1}
        }

        expect(lineUtil.isHLine(line)).toBe(true);


    });

    it("isHLine should return false when there only a change on the y-axis", function () {

        var lineUtil = dotBox.utility.line,
            line = {};

        line = {
            d1: {x: 2, y: 0},
            d2: {x: 2, y: 1}
        }

        expect(lineUtil.isHLine(line)).toBe(false);



        line = {
            d1: {x: 2, y: 2},
            d2: {x: 2, y: 1}
        }

        expect(lineUtil.isHLine(line)).toBe(false);


    });

    describe("method getBoxesFromLine", function () {

        var dotCountLength = 3,
            dotCountWidth = 4,
            getBoxesFromLine;

        getBoxesFromLine = function (line) {
            return lineUtil.getBoxesFromLine(line, dotCountLength, dotCountWidth);
        };


        describe("for a horizontal line", function () {


            it("should get a single box for the top most line", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 0, y: 0},
                    d2: {x: 1, y: 0}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(0);

                line = {
                    d1: {x: 2, y: 0},
                    d2: {x: 1, y: 0}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(1);


            });

            it("should get a single box for the bottom most line", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 0, y: 3},
                    d2: {x: 1, y: 3}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(4);

                line = {
                    d1: {x: 2, y: 3},
                    d2: {x: 1, y: 3}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(5);


            });

            it("should get both top and bottom boxes it the line is interior", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 0, y: 1},
                    d2: {x: 1, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(2);
                expect(boxes[0]).toBe(2);
                expect(boxes[1]).toBe(0);

                line = {
                    d1: {x: 2, y: 2},
                    d2: {x: 1, y: 2}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(2);
                expect(boxes[0]).toBe(5);
                expect(boxes[1]).toBe(3);


            });


        });

        describe("for a vertical line", function () {


            it("should get a single box for the left most line", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 0, y: 0},
                    d2: {x: 0, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(0);

                line = {
                    d1: {x: 0, y: 3},
                    d2: {x: 0, y: 2}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(4);


            });

            it("should get a single box for the right most line", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 2, y: 0},
                    d2: {x: 2, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(1);

                line = {
                    d1: {x: 2, y: 2},
                    d2: {x: 2, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(1);
                expect(boxes[0]).toBe(3);


            });

            it("should get both left and right boxes it the line is interior", function () {

                var line,
                    boxes;

                line = {
                    d1: {x: 1, y: 0},
                    d2: {x: 1, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(2);
                expect(boxes[0]).toBe(1);
                expect(boxes[1]).toBe(0);

                line = {
                    d1: {x: 1, y: 2},
                    d2: {x: 1, y: 1}
                };

                boxes = getBoxesFromLine(line);
                expect(boxes.length).toBe(2);
                expect(boxes[0]).toBe(3);
                expect(boxes[1]).toBe(2);


            });


        });

    });

    describe("method getLinesFromBox", function () {

        beforeEach(function() {
            this.addMatchers({

                toBeMatchingLine: function(expected) {
                    var actual = JSON.stringify(this.actual);
                    var exp = JSON.stringify(expected);
                    var notText = this.isNot ? " not" : "";

                    this.message = function () {
                        return "Expected " + actual + " to be same as " + exp;
                    }

                    return actual === exp;
                }

            });
        });

        it("should get the correct lines for a left edge box", function () {

            var dotCountLength = 3,
                actLines,
                expLines = [],
                i;


            expLines.push({ d1: {x: 0, y: 0}, d2: {x: 1, y: 0} });
            expLines.push({ d1: {x: 1, y: 0}, d2: {x: 1, y: 1} });
            expLines.push({ d1: {x: 0, y: 1}, d2: {x: 1, y: 1} });
            expLines.push({ d1: {x: 0, y: 0}, d2: {x: 0, y: 1} });

            actLines = lineUtil.getLinesFromBox(0, dotCountLength);

            for(i = 0; i < expLines.length; i++) {
                expect(actLines[i]).toBeMatchingLine(expLines[i]);
            }



        });

        it("should get the correct lines for a right edge box", function () {

            var dotCountLength = 3,
                actLines,
                expLines = [],
                i;


            expLines.push({ d1: {x: 1, y: 1}, d2: {x: 2, y: 1} });
            expLines.push({ d1: {x: 2, y: 1}, d2: {x: 2, y: 2} });
            expLines.push({ d1: {x: 1, y: 2}, d2: {x: 2, y: 2} });
            expLines.push({ d1: {x: 1, y: 1}, d2: {x: 1, y: 2} });

            actLines = lineUtil.getLinesFromBox(3, dotCountLength);

            for(i = 0; i < expLines.length; i++) {
                expect(actLines[i]).toBeMatchingLine(expLines[i]);
            }



        });

        it("should get the correct lines for an interior box", function () {

            var dotCountLength = 4,
                actLines,
                expLines = [],
                i;


            expLines.push({ d1: {x: 1, y: 2}, d2: {x: 2, y: 2} });
            expLines.push({ d1: {x: 2, y: 2}, d2: {x: 2, y: 3} });
            expLines.push({ d1: {x: 1, y: 3}, d2: {x: 2, y: 3} });
            expLines.push({ d1: {x: 1, y: 2}, d2: {x: 1, y: 3} });

            actLines = lineUtil.getLinesFromBox(7, dotCountLength);

            for(i = 0; i < expLines.length; i++) {
                expect(actLines[i]).toBeMatchingLine(expLines[i]);
            }



        });

    });

});