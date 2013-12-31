/*global describe, it, expect, dotBox */


describe("dotBox.utility.lineSet", function (){

    var lineState = dotBox.lineState;

    it("should construct", function () {

        var target,
            act;

        act = function () {
            target = lineState(10, 10);
        };

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

        target = lineState(dotCountL, dotCountW);

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

        target = lineState(dotCountL, dotCountW);

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

        target = lineState(dotCountL, dotCountW);

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

        target = lineState(dotCountL, dotCountW);

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

            target = lineState(3, 4);

            act = function () {
                target.connected();
            };

            expect(act).toThrow();

        });

        it("should fail when line is null", function () {

            var target,
                act;

            target = lineState(3, 4);

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

            target = lineState(dotCountLength, dotCountWidth);

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

            target = lineState(dotCountLength, dotCountWidth);

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

            target = lineState(dotCountLength, dotCountWidth);

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
                target = lineState(3, 4);

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
                target = lineState(3, 4);

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
                target = lineState(3, 4);

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

                target = lineState(dotCountLength, dotCountWidth);

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
                target = lineState(3, 4);

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

                target = lineState(dotCountLength, dotCountWidth);

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
                target = lineState(3, 4);

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
                target = lineState(3, 4);

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
                target = lineState(3, 4);

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

                target = lineState(dotCountLength, dotCountWidth);

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
                target = lineState(3, 4);

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

                target = lineState(dotCountLength, dotCountWidth);

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

    it("method isBoxClosed should return true when all of it's sides are connected", function () {

        var expClosedBoxIndex = 0,
            LENGTH = 4,
            WIDTH = 4,
            lineState = dotBox.lineState(LENGTH, WIDTH),
            box,
            bIt,
            isBoxClosed;

        lineState.connected({d1: {x: 0, y: 0}, d2: {x: 1, y: 0}}, true);
        lineState.connected({d1: {x: 0, y: 1}, d2: {x: 1, y: 1}}, true);
        lineState.connected({d1: {x: 1, y: 1}, d2: {x: 1, y: 0}}, true);
        lineState.connected({d1: {x: 0, y: 1}, d2: {x: 0, y: 0}}, true);

        bIt = boxIterator(LENGTH, WIDTH);

        while(box = bIt.next()) {

            isBoxClosed = lineState.isBoxClosed(box.boxIndex);
            if(box.boxIndex === expClosedBoxIndex) {
                expect(isBoxClosed).toBe(true);
            } else {
                expect(isBoxClosed).toBe(false);
            }

        }

    });

    it("method isBoxClosed should return false a side is open", function () {

        var i,
            j,
            LENGTH = 4,
            WIDTH = 4,
            target = lineState(LENGTH, WIDTH),
            allSides = [];

        allSides.push({d1: {x: 0, y: 0}, d2: {x: 1, y: 0}});
        allSides.push({d1: {x: 0, y: 1}, d2: {x: 1, y: 1}});
        allSides.push({d1: {x: 1, y: 1}, d2: {x: 1, y: 0}});
        allSides.push({d1: {x: 0, y: 1}, d2: {x: 0, y: 0}});

        for(i = 0; i < 4; i++ ) {

            //Create a fresh state.
            target = lineState(LENGTH, WIDTH);

            for(j = 0; j < 4; j++) {
                if(j !== i) {
                    //Connect all sides except when j matches i.
                    target.connected(allSides[j], true);
                }
            }

            expect(target.isBoxClosed(0)).toBe(false);

        }



    });

    describe("getAllLinesForDot", function () {

        var LEN = 5,
            WIDTH = 5,
            target = lineState(LEN, WIDTH);

        beforeEach(function() {
            this.addMatchers({
                toBeSameLine: function(expected) {

                    return areLinesSame(this.actual, expected);
                }
            });
        });

        it("should return two lines for corner dots", function () {

            var actLines,
                x,
                y;

            //Top left corner
            x = 0;
            y = 0;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(2);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 0}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 1}});

            //Top right corner
            x = LEN - 1;
            y = 0;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(2);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 4, y: 1}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 3, y: 0}});

            //Bottom right corner
            x = LEN - 1;
            y = WIDTH - 1;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(2);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 4, y: 3}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 3, y: 4}});

            //Bottom left corner
            x = 0;
            y = WIDTH - 1;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(2);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 3}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 4}});


        });


        it("should return three lines for non-corner edge dots", function () {

            var actLines,
                x,
                y;


            x = 1;
            y = 0;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(3);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 2, y: 0}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 1}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 0}});

            x = 4;
            y = 1;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(3);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 4, y: 0}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 4, y: 2}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 3, y: 1}});

            x = 2;
            y = 4;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(3);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 2, y: 3}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 3, y: 4}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 4}});

            x = 0;
            y = 3;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(3);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 2}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 3}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 4}});

        });

        it("should return four lines for interior dots", function () {

            var actLines,
                x,
                y;


            x = 1;
            y = 1;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(4);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 0}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 2, y: 1}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 2}});
            expect(actLines[3]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 0, y: 1}});

            x = 2;
            y = 3;
            actLines = target.getAllLinesForDot({x: x, y: y});
            expect(actLines.length).toBe(4);
            expect(actLines[0]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 2, y: 2}});
            expect(actLines[1]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 3, y: 3}});
            expect(actLines[2]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 2, y: 4}});
            expect(actLines[3]).toBeSameLine({d1: {x: x, y: y}, d2: {x: 1, y: 3}});

        });



    });

    it("getOpenLinesForDot should filter dot-lines to only those that are connected", function () {

        var target = lineState(5, 5),
            callCount_getAllLinesForDot = 0,
            x = 1,
            y = 3,
            l1 = {id : 1},
            l2 = {id : 2},
            l3 = {id : 3},
            l4 = {id: 4},
            connectedCallArgs = [],
            actResults;

        //Mock this method.
        target.getAllLinesForDot = function(dot) {
            callCount_getAllLinesForDot += 1;
            expect(dot.x).toBe(x);
            expect(dot.y).toBe(y);

            return [l1, l2, l3, l4];
        };

        target.connected = function (l) {

            connectedCallArgs.push(l);

            if(l.id === 2 || l.id === 4) { return true; }
            else { return false; }

        };

        actResults = target.getOpenLinesForDot({x: x, y: y});

        expect(callCount_getAllLinesForDot).toBe(1);
        expect(connectedCallArgs.length).toBe(4);
        expect(connectedCallArgs[0]).toBe(l1);
        expect(connectedCallArgs[1]).toBe(l2);
        expect(connectedCallArgs[2]).toBe(l3);
        expect(connectedCallArgs[3]).toBe(l4);

        expect(actResults.length).toBe(2);
        expect(actResults[0]).toBe(l1);
        expect(actResults[1]).toBe(l3);


    });

});

function areLinesSame(line1, line2) {

    if(line1.d1.x !== line2.d1.x) return false;
    if(line1.d1.y !== line2.d1.y) return false;
    if(line1.d2.x !== line2.d2.x) return false;
    if(line1.d2.y !== line2.d2.y) return false;

    return true;

}

