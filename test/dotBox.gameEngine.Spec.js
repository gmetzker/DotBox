/*global describe, it, expect, dotBox */




describe("dotBox.gameEngine", function () {

    var DEFAULT_PLAYER_COUNT = 2,
        DEFAULT_DOT_COUNT_LENGTH = 10,
        DEFAULT_DOT_COUNT_WIDTH = 10,
        DEFAULT_START_PLAYER = 0;

    describe("factory", function () {



        it("should create a new gameEngine", function () {

            var expDotCountWidth = 12,
                expDotCountLength = 15,
                expPlayerCount = 2,
                expStartPlayer = 1,
                config,
                target;

            config = {
                dotCountLength: expDotCountLength,
                dotCountWidth: expDotCountWidth,
                playerCount: expPlayerCount,
                startPlayer: expStartPlayer
            };

            target = dotBox.gameEngine(config);

            expect(target).not.toBeNull();

            expect(target.getDotCountLength()).toBe(expDotCountLength);
            expect(target.getDotCountWidth()).toBe(expDotCountWidth);
            expect(target.getPlayerCount()).toBe(expPlayerCount);
            expect(target.getCurrentPlayer()).toBe(expStartPlayer);
            expect(target.getBoxCount()).toBe((expDotCountLength - 1) * (expDotCountWidth - 1));

        });


        it("should have defaults if constructed with no arguments", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine();
            };

            expect(act).not.toThrow();

            expect(target.getDotCountLength()).toBe(DEFAULT_DOT_COUNT_LENGTH);
            expect(target.getDotCountWidth()).toBe(DEFAULT_DOT_COUNT_WIDTH);
            expect(target.getPlayerCount()).toBe(DEFAULT_PLAYER_COUNT);
            expect(target.getCurrentPlayer()).toBe(DEFAULT_START_PLAYER);
            expect(target.getBoxCount()).toBe((DEFAULT_DOT_COUNT_LENGTH - 1) * (DEFAULT_DOT_COUNT_WIDTH - 1));


        });



        it("should have defaults if any arguments missing", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine({});
            };
            expect(act).not.toThrow();

            expect(target.getDotCountLength()).toBe(DEFAULT_DOT_COUNT_LENGTH);
            expect(target.getDotCountWidth()).toBe(DEFAULT_DOT_COUNT_WIDTH);
            expect(target.getPlayerCount()).toBe(DEFAULT_PLAYER_COUNT);
            expect(target.getCurrentPlayer()).toBe(DEFAULT_START_PLAYER);
            expect(target.getBoxCount()).toBe((DEFAULT_DOT_COUNT_LENGTH - 1) * (DEFAULT_DOT_COUNT_WIDTH - 1));

        });


        it("should throw an error if dotCountLength is not a number", function () {

            var target,
                act,
                config;

            config = {
                dotCountLength: "hello"
            };

            act = function () {
                target = dotBox.gameEngine(config);
            };

            expect(act).toThrow();

        });

        it("should throw an error if dotCountWidth is not a number", function () {

            var target,
                act,
                config;

            config = {
                dotCountWidth: "hello"
            };

            act = function () {
                target = dotBox.gameEngine(config);
            };

            expect(act).toThrow();

        });



        it("should throw an error if playerCount is not a number", function () {

            var target,
                act,
                config;

            config = {
                playerCount: "hello"
            };

            act = function () {
                target = dotBox.gameEngine(config);
            };

            expect(act).toThrow();

        });

        it("should throw an error if startPlayer is not a number", function () {

            var target,
                act,
                config;

            config = {
                startPlayer: "hello"
            };

            act = function () {
                target = dotBox.gameEngine(config);
            };

            expect(act).toThrow();

        });

        it("should throw an error if dotCountLength is less than 3", function () {

            var target,
                act;



            act = function () {
                target = dotBox.gameEngine({dotCountLength: 2});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountLength: 1});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountLength: 0});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountLength: -1});
            };
            expect(act).toThrow();

        });


        it("should throw an error if dotCountWidth is less than 3", function () {

            var target,
                act;


            act = function () {
                target = dotBox.gameEngine({dotCountWidth: 2});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountWidth: 1});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountWidth: 0});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({dotCountWidth: -1});
            };
            expect(act).toThrow();

        });



        it("should throw an error if playerCount is less than 2", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine({playerCount: 1});
            };
            expect(act).toThrow();


            act = function () {
                target = dotBox.gameEngine({playerCount: 0});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({playerCount: -1});
            };
            expect(act).toThrow();

        });

        it("should throw an error if startPlayer is less than 0", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine({startPlayer: -1});
            };
            expect(act).toThrow();


        });

        it("should throw an error if startPlayer is eq to playerCount", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine({startPlayer: DEFAULT_PLAYER_COUNT});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({
                    playerCount: 3,
                    startPlayer: 3});
            };
            expect(act).toThrow();


        });

        it("should throw an error if startPlayer is gt playerCount", function () {

            var target,
                act;

            act = function () {
                target = dotBox.gameEngine({startPlayer: DEFAULT_PLAYER_COUNT + 1});
            };
            expect(act).toThrow();

            act = function () {
                target = dotBox.gameEngine({
                    playerCount: 3,
                    startPlayer: 4});
            };
            expect(act).toThrow();


        });

        it("should be have a box count length one less than dot count", function () {

            var expDotCountLength = 13,
                config,
                target;

            config = { dotCountLength: expDotCountLength };

            target = dotBox.gameEngine(config);


            expect(target.getBoxCountLength()).toBe(expDotCountLength - 1);

        });



        it("should be have a box count width one less than dot count", function () {

            var expDotCountWidth = 12,
                config,
                target;

            config = { dotCountWidth: expDotCountWidth };

            target = dotBox.gameEngine(config);


            expect(target.getBoxCountWidth()).toBe(expDotCountWidth - 1);

        });

        it("should have no line connections after construction", function () {

            var target,
                vIt,
                hIt,
                config,
                tempLine;

            config = {
                dotCountLength: 3,
                dotCountWidth: 4
            };

            target = dotBox.gameEngine(config);
            vIt = vLineIterator(config.dotCountLength, config.dotCountWidth);
            hIt = hLineIterator(config.dotCountLength, config.dotCountWidth);

            while(tempLine = vIt.next()) {

                expect(target.isLineConnected(tempLine)).toBe(false)

            }

            while(tempLine = hIt.next()) {

                expect(target.isLineConnected(tempLine)).toBe(false);

            }

        });

    });

    function createConfigForGameOver(isGameOver) {

        var i,
            DOT_COUNT_LENGTH = 4,
            DOT_COUNT_WIDTH = 4,
            mockBoxState = dotBox.boxState(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH),
            config;


        mockBoxState.areAllBoxesScored = function () {

            if( isGameOver === undefined ) {
                return true;
            } else {
                return isGameOver;
            }

        };

        config = {
            dotCountLength: DOT_COUNT_LENGTH,
            dotCountWidth: DOT_COUNT_WIDTH,
            boxState: mockBoxState
        };

        return config;

    }



    it("isGameOver should return true if box state has all boxes scored", function () {

        var config,
            target;


        config = createConfigForGameOver();


        target = dotBox.gameEngine(config);


        expect(target.isGameOver()).toBe(true);

    });

    it("isGameOver should return false if box state has all boxes scored", function () {

        var config,
            target;


        config = createConfigForGameOver(false);


        target = dotBox.gameEngine(config);


        expect(target.isGameOver()).toBe(false);

    });
    
    describe("connectLine", function() {

        it("should throw an error if the game is already over", function () {

            var config,
                line,
                target,
                act;

            config = createConfigForGameOver();
            line = {
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            };

            target = dotBox.gameEngine(config);

            act = function() {  target.connectLine(line); };


            expect(act).toThrow();


        });

        it("should throw an error if the line is already connected", function () {

            var config,
                line,
                target,
                act,
                mockLineSet,
                expMsg = 'This line is already connected.';

            line = {
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            };

            //Create a mocked lineSet that pretends all lines are connected.
            mockLineSet = {
                connected: function(l, v) {

                    expect(l).toBe(line);
                    expect(v).toBeUndefined();
                    return true;

                }
            };

            config = {
              lineSet: mockLineSet
            };



            target = dotBox.gameEngine(config);

            act = function() {  target.connectLine(line); };

            expect(act).toThrow(expMsg);




        });

        it("should throw an error if the lineSet.connected throws an error ", function () {

            var config,
                line,
                target,
                act,
                mockLineSet,
                expMessage = 'Bad error';

            line = {
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            };

            //Create a mocked lineSet that throws an error, when
            //it is queried without the set value.
            mockLineSet = {
                connected: function(l, v) {

                    expect(l).toBe(line);
                    if( v === undefined) {
                        throw new Error(expMessage);
                    }
                    return false;
                }
            };

            config = {
                lineSet: mockLineSet
            };



            target = dotBox.gameEngine(config);

            act = function() {  target.connectLine(line); };

            expect(act).toThrow(expMessage);




        });


        it("should cycle the player if no box was closed during turn", function () {

            var i,
                config,
                DOT_EDGE_COUNT = 11,
                PLAYER_COUNT = 3,
                target,
                expPlayer,
                expNextPlayer,
                line,
                result;

            config = {
                dotCountLength: DOT_EDGE_COUNT,
                dotCountWidth: DOT_EDGE_COUNT,
                playerCount: PLAYER_COUNT,
                startPlayer: 0
            };

            target = dotBox.gameEngine(config);

            //Iterate and connect lines horizontally.
            //This should ensure no boxes are made,
            //and the player should change each turn.

            for(i = 0; i < DOT_EDGE_COUNT - 1; i++) {

                expPlayer = i % 3;
                expect(target.getCurrentPlayer()).toBe(expPlayer);


                line = {
                    d1: {x: i, y: 0},
                    d2: {x: i + 1, y: 0}
                };

                result = target.connectLine(line);

                expNextPlayer = (i + 1) % 3;
                expect(result.nextPlayer).toBe(expNextPlayer);


            }


        });

        it("should call lineSet.connectLine for same line", function () {


            var config,
                line,
                target,
                mockLineSet,
                connectSetCallCount = 0;

            line = {
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            };

            //Create a mocked lineSet that throws an error, when
            //it is queried without the set value.
            mockLineSet = {
                connected: function(l, v) {


                    if( v === undefined) {
                        //When v is undefined this just a query
                        //to see if line is connected, lets pretend
                        //it's not and return false.
                        return false;
                    } else {
                        //Make sure it's the same line.
                        connectSetCallCount += 1;

                        //Make sure the same line was passed in.
                        expect(l).toBe(line);
                        return true;
                    }


                },
                isBoxClosed: function() {return false; }

            };

            config = {
                lineSet: mockLineSet
            };



            target = dotBox.gameEngine(config);

            target.connectLine(line);

            expect(connectSetCallCount).toBe(1);


        });

        it("should return result with gameOver eq true when it the line completes the game", function () {

            var config,
                target,
                lastLine,
                result,
                isGameOverCallCount = 0;

            config = createConfigForGameOver();


            config.boxState.areAllBoxesScored = function() {

                if( isGameOverCallCount === 0) {
                    isGameOverCallCount += 1;
                    return false;
                } else {
                    isGameOverCallCount += 1;
                    return true;
                }
            };

            //Mock the lineSet to indicate a closed box.
            config.lineSet = dotBox.utility.lineSet(4, 4);
            config.lineSet.isBoxClosed = function (index) { return true; };

            lastLine = {
                d1: {x: 0, y: 0},
                d2: {x: 1, y: 0}
            };

            target = dotBox.gameEngine(config);


            result = target.connectLine(lastLine);

            //Game should now be over.
            expect(result.gameOver).toBe(true);
            expect(result.nextPlayer).toBe(null);
            expect(target.getCurrentPlayer()).toBe(null);




        });

        it("should not change the box state if no boxes scored", function () {

            var i,
                target,
                line,
                config,
                result,
                DOT_COUNT_LENGTH = 4,
                DOT_COUNT_WIDTH = 4,
                BOX_COUNT = 9,
                boxState = dotBox.boxState(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH);



            config = {
                dotCountLength: DOT_COUNT_LENGTH,
                dotCountWidth:  DOT_COUNT_WIDTH,
                boxState: boxState
            };


            line = {
                d1: {x: 0, y: 0},
                d2: {x: 1, y: 0}
            };

            target = dotBox.gameEngine(config);


            result = target.connectLine(line);

            expect(result.boxesScored.length).toBe(0);

            for(i = 0; i < BOX_COUNT; i++) {
                expect(boxState.isBoxScored(i)).toBe(false);
            }



        });

        it("should have the correct box scored when a single box scored ", function () {

            var i,
                target,
                config,
                result,
                DOT_COUNT_LENGTH = 4,
                DOT_COUNT_WIDTH = 4,
                BOX_COUNT = 9,
                boxState = dotBox.boxState(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH),
                currentPlayer = 1;

            lineSet = dotBox.utility.lineSet(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH);


            config = {
                dotCountLength: DOT_COUNT_LENGTH,
                dotCountWidth:  DOT_COUNT_WIDTH,
                boxState: boxState,
                lineSet: lineSet,
                startPlayer: currentPlayer,
                playerCount: 2
            };




            lineSet.connected({
                d1: {x: 0, y: 0},
                d2: {x: 1, y: 0}
            }, true);

            lineSet.connected({
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            }, true);


            lineSet.connected({
                d1: {x: 0, y: 1},
                d2: {x: 1, y: 1}
            }, true);



            target = dotBox.gameEngine(config);


            result = target.connectLine({
                d1: {x: 1, y: 0},
                d2: {x: 1, y: 1}
            });


            expect(result.boxesScored.length).toBe(1);
            expect(result.boxesScored[0]).toBe(0);

            expect(boxState.whichPlayerScoredBox(0)).toBe(currentPlayer);

            for(i = 1; i < BOX_COUNT; i++) {
                expect(boxState.isBoxScored(i)).toBe(false);
            }

            //Player scored so the same player will be the next and current player.
            expect(result.nextPlayer).toBe(currentPlayer);
            expect(target.getCurrentPlayer()).toBe(currentPlayer);



        });

        it("should have the correct boxes scored when two boxes scored ", function () {

            var i,
                target,
                config,
                result,
                DOT_COUNT_LENGTH = 4,
                DOT_COUNT_WIDTH = 4,
                BOX_COUNT = 9,
                boxState,
                currentPlayer = 1;

            boxState = dotBox.boxState(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH);
            lineSet = dotBox.utility.lineSet(DOT_COUNT_LENGTH, DOT_COUNT_WIDTH);


            config = {
                dotCountLength: DOT_COUNT_LENGTH,
                dotCountWidth:  DOT_COUNT_WIDTH,
                boxState: boxState,
                lineSet: lineSet,
                startPlayer: currentPlayer,
                playerCount: 2
            };




            lineSet.connected({
                d1: {x: 0, y: 0},
                d2: {x: 1, y: 0}
            }, true);

            lineSet.connected({
                d1: {x: 0, y: 0},
                d2: {x: 0, y: 1}
            }, true);


            lineSet.connected({
                d1: {x: 0, y: 1},
                d2: {x: 1, y: 1}
            }, true);


            lineSet.connected({
                d1: {x: 1, y: 0},
                d2: {x: 2, y: 0}
            }, true);

            lineSet.connected({
                d1: {x: 2, y: 0},
                d2: {x: 2, y: 1}
            }, true);

            lineSet.connected({
                d1: {x: 1, y: 1},
                d2: {x: 2, y: 1}
            }, true);


            target = dotBox.gameEngine(config);


            //This should connect two boxes
            result = target.connectLine({
                d1: {x: 1, y: 0},
                d2: {x: 1, y: 1}
            });


            expect(result.boxesScored.length).toBe(2);

            expect(result.boxesScored).toContain(0);
            expect(result.boxesScored).toContain(1);

            expect(boxState.whichPlayerScoredBox(0)).toBe(currentPlayer);
            expect(boxState.whichPlayerScoredBox(1)).toBe(currentPlayer);

            for(i = 2; i < BOX_COUNT; i++) {

                //All other boxes should be unclaimed still.
                expect(boxState.isBoxScored(i)).toBe(false);

            }

            //Player scored so the same player will be the next and current player.
            expect(result.nextPlayer).toBe(currentPlayer);
            expect(target.getCurrentPlayer()).toBe(currentPlayer);



        });


    });

});
