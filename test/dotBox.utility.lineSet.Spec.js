/*global describe, it, expect, dotBox */


describe("dotBox.utility.lineSet", function (){

    var lineSet = dotBox.utility.lineSet;

    it("should construct", function () {

        var target,
            act;

        act = function () {
            target = lineSet(10, 10);
        }

        expect(act).not.toThrow();
        expect(target).not.toBeNull();

    });


    it("should have all horizontal lines unconnected after construction", function () {

        var line,
            target,
            dotCountL = 3,
            dotCountW = 4,
            isConnected,
            hIt;


        hIt = hLineIterator(dotCountL, dotCountW);

        target = lineSet(dotCountL, dotCountW);

        while(line = hIt.next()) {

            isConnected = target.connected(line);
            expect(isConnected).toBe(false);

        }


    });

    it("should have all vertical lines unconnected after construction", function () {

        var target,
            dotCountL = 3,
            dotCountW = 4,
            isConnected,
            vIt,
            line;

        vIt = vLineIterator(dotCountL, dotCountW);

        target = lineSet(dotCountL, dotCountW);

        while(line = vIt.next()) {

            isConnected = target.connected(line);
            expect(isConnected).toBe(false);

        }


    });

    it("should be able to set a vertical line connection without affecting other lines", function () {


        var target,
            dotCountL = 3,
            dotCountW = 4,
            outerIt,
            hIt,
            vIt,
            line,
            testLine;

        outerIt = vLineIterator(dotCountL, dotCountW);
        hIt = hLineIterator(dotCountL, dotCountW);
        vIt = vLineIterator(dotCountL, dotCountW);

        target = lineSet(dotCountL, dotCountW);

        while(line = outerIt.next()) {

            target.connected(line, true);

            //Iterate over all vertical lines.  They should all be unconnected
            //accept the current line.
            while(testLine = vIt.next()) {

                if(areLinesSame(line, testLine)) {
                    expect(target.connected(testLine)).toBe(true);
                } else {
                    expect(target.connected(testLine)).toBe(false);
                }

            }

            // All horizontal lines should be unaffected.
            while(testLine = hIt.next()) {
                expect(target.connected(testLine)).toBe(false);
            }
        }



    });

    it("should be able to set a horizontal line connection without affecting other lines", function () {


        var target,
            dotCountL = 3,
            dotCountW = 4,
            outerIt,
            hIt,
            vIt,
            line,
            testLine;

        outerIt = hLineIterator(dotCountL, dotCountW);
        hIt = hLineIterator(dotCountL, dotCountW);
        vIt = vLineIterator(dotCountL, dotCountW);

        target = lineSet(dotCountL, dotCountW);

        while(line = outerIt.next()) {

            target.connected(line, true);

            //Iterate over all horizontal lines.  They should all be unconnected
            //accept the current line.
            while(testLine = hIt.next()) {

                if(areLinesSame(line, testLine)) {
                    expect(target.connected(testLine)).toBe(true);
                } else {
                    expect(target.connected(testLine)).toBe(false);
                }

            }

            // All vertical lines should be unaffected.
            while(testLine = vIt.next()) {
                expect(target.connected(testLine)).toBe(false);
            }
        }



    });

    describe("line validation", function() {

        it("should fail when line is undefined", function () {

            var target,
                act;

            target = lineSet(3, 4);

            act = function () {
                target.connected();
            };

            expect(act).toThrow();

        });

        it("should fail when line is null", function () {

            var target,
                act;

            target = lineSet(3, 4);

            act = function () {
                target.connected(null);
            };

            expect(act).toThrow();

        });

        it("should fail when line exceeds two dots in length", function () {

            var target,
                act,
                line,
                dotCountLength = 3,
                dotCountWidth = 4,
                p1 = {x: 0, y: 0},
                p2 = {x: 2, y: 0};

            target = lineSet(dotCountLength, dotCountWidth);

            line = {d1: p1, d2 : p2};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



            line = {d1: p2, d2 : p1};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



        });

        it("should fail when line exceeds two dots in width", function () {

            var target,
                act,
                line,
                dotCountLength = 3,
                dotCountWidth = 4,
                p1 = {x: 0, y: 0},
                p2 = {x: 0, y: 2};

            target = lineSet(dotCountLength, dotCountWidth);

            line = {d1: p1, d2 : p2};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



            line = {d1: p2, d2 : p1};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



        });

        it("should fail if line is diagonal", function () {

            var target,
                act,
                line,
                dotCountLength = 3,
                dotCountWidth = 4,
                p1 = {x: 0, y: 0},
                p2 = {x: 1, y: 1};

            target = lineSet(dotCountLength, dotCountWidth);

            line = {d1: p1, d2 : p2};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



            line = {d1: p2, d2 : p1};

            act = function () {
                target.connected(line);
            };

            expect(act).toThrow();



        });

        describe("for line.d1", function () {


            it("should fail when line d1 is undefined", function () {

                var target,
                    act,
                    line;

                line = {d2 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d1 is null", function () {

                var target,
                    act,
                    line;

                line = {d1: null, d2 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d1.x lt 0", function () {

                var target,
                    act,
                    line;

                line = {d1: {x: -1, y: 1}, d2 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d1.x gt or equal to dotCountLength", function () {

                var target,
                    act,
                    line,
                    dotCountLength = 3,
                    dotCountWidth = 4;

                target = lineSet(dotCountLength, dotCountWidth);

                line = {d1: {x: dotCountLength, y: 1}, d2 : {x: 0, y: 1}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();


                line = {d1: {x: dotCountLength + 1, y: 1}, d2 : {x: 0, y: 1}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d1.y lt 0", function () {

                var target,
                    act,
                    line;

                line = {d1: {x: 0, y: -1}, d2 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d1.y gt or equal to dotCountWidth", function () {

                var target,
                    act,
                    line,
                    dotCountLength = 3,
                    dotCountWidth = 4;

                target = lineSet(dotCountLength, dotCountWidth);

                line = {d1: {x: 0, y: dotCountWidth}, d2 : {x: 0, y: dotCountWidth - 2}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();


                line = {d1: {x: 0 , y: dotCountWidth + 1}, d2 : {x: 0, y: dotCountWidth - 2}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

        });


        describe("for line.d2", function () {

            it("should fail when line d2 is undefined", function () {

                var target,
                    act,
                    line;

                line = {d1 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d2 is null", function () {

                var target,
                    act,
                    line;

                line = {d2: null, d1 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d2.x lt 0", function () {

                var target,
                    act,
                    line;

                line = {d2: {x: -1, y: 1}, d1 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d2.x gt or equal to dotCountLength", function () {

                var target,
                    act,
                    line,
                    dotCountLength = 3,
                    dotCountWidth = 4;

                target = lineSet(dotCountLength, dotCountWidth);

                line = {d2: {x: dotCountLength, y: 1}, d1 : {x: 0, y: 1}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();


                line = {d2: {x: dotCountLength + 1, y: 1}, d1 : {x: 0, y: 1}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d2.y lt 0", function () {

                var target,
                    act,
                    line;

                line = {d2: {x: 0, y: -1}, d1 : {x: 0, y: 1}};
                target = lineSet(3, 4);

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

            it("should fail when line d2.y gt or equal to dotCountWidth", function () {

                var target,
                    act,
                    line,
                    dotCountLength = 3,
                    dotCountWidth = 4;

                target = lineSet(dotCountLength, dotCountWidth);

                line = {d2: {x: 0, y: dotCountWidth}, d1 : {x: 0, y: dotCountWidth - 2}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();


                line = {d2: {x: 0 , y: dotCountWidth + 1}, d1 : {x: 0, y: dotCountWidth - 2}};

                act = function () {
                    target.connected(line);
                };

                expect(act).toThrow();

            });

        });
    });

});

function areLinesSame(line1, line2) {

    if(line1.d1.x !== line2.d1.x) return false;
    if(line1.d1.y !== line2.d1.y) return false;
    if(line1.d2.x !== line2.d2.x) return false;
    if(line1.d2.y !== line2.d2.y) return false;

    return true;

}