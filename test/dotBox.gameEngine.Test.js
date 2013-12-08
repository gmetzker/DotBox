/*global describe, it, expect, dotBox */

/*


describe("The gameEngine factory", function () {

    var DEFAULT_PLAYER_COUNT = 2,
        DEFAULT_DOT_COUNT_LENGTH = 10,
        DEFAULT_DOT_COUNT_WIDTH = 10;

    it("should create a new gameEngine", function () {

        var expDotCountWidth = 12,
            expDotCountLength = 15,
            expPlayerCount = 2,
            config,
            target;

        config = {
            dotCountLength: expDotCountLength,
            dotCountWidth: expDotCountWidth,
            playerCount: expPlayerCount
        };

        target = dotBox.gameEngine(config);

        expect(target).not.toBeNull();

        expect(target.getDotCountLength()).toBe(expDotCountLength);
        expect(target.getDotCountWidth()).toBe(expDotCountWidth);
        expect(target.getPlayerCount()).toBe(expPlayerCount);

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

    it("should be have a correct horizontal line count", function () {

        var expHorizontalLineCount = 8,
            config,
            target;

        config = {
            dotCountLength: 3,
            dotCountWidth: 4
        };

        target = dotBox.gameEngine(config);


        expect(target.getLineCountHorizontal()).toBe(expHorizontalLineCount);

    });

    it("should be have a correct vertical line count", function () {

        var expVerticalLineCount = 9,
            config,
            target;

        config = {
            dotCountLength: 3,
            dotCountWidth: 4
        };

        target = dotBox.gameEngine(config);


        expect(target.getLineCountVertical()).toBe(expVerticalLineCount);

    });


});


describe("The gameEngine.isHzLineClosed method", function () {

    var config,
        expBoxCountLength = 2,
        expBoxCountWidth = 3;

    config = {
        dotCountLength: 3,
        dotCountWidth: 4
    };

    it("should throw an error if row is less than 0", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isHzLineClosed(-1, 0);
        };

        expect(act).toThrow();


    });

    it("should throw an error if row exceeds dotCountWidth-1 ", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isHzLineClosed(config.dotCountWidth, 0);
        };

        expect(act).toThrow();

        act = function () {
            target.isHzLineClosed(config.dotCountWidth + 1, 0);
        };

        expect(act).toThrow();



    });


    it("should throw an error if col is less than 0", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isHzLineClosed(0, -1);
        };

        expect(act).toThrow();


    });

    it("should throw an error if col exceeds boxCountLength-1 ", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isHzLineClosed(0, expBoxCountLength);
        };

        expect(act).toThrow();

        act = function () {
            target.isHzLineClosed(0, expBoxCountLength + 1);
        };

        expect(act).toThrow();



    });

    it("should be false for all lines after construction", function () {

        var target,
            actValue,
            row,
            col,
            totalLineCount = 0;

        target = dotBox.gameEngine(config);


        for (row = 0; row < target.getDotCountWidth(); row++) {

            for (col = 0; col < target.getBoxCountLength(); col++) {

                actValue = target.isHzLineClosed(row, col);

                expect(actValue).toBe(false);

                totalLineCount += 1;

            }

        }

        expect(totalLineCount).toBe(target.getLineCountHorizontal());



    });


});


describe("The gameEngine.isVtLineClosed method", function () {

    var config,
        expBoxCountLength = 2,
        expBoxCountWidth = 3;

    config = {
        dotCountLength: 3,
        dotCountWidth: 4
    };

    it("should throw an error if row is less than 0", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isVtLineClosed(-1, 0);
        };

        expect(act).toThrow();


    });

    it("should throw an error if row exceeds boxCountWidth-1 ", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isVtLineClosed(expBoxCountWidth, 0);
        };

        expect(act).toThrow();

        act = function () {
            target.isHzLineClosed(expBoxCountWidth + 1, 0);
        };

        expect(act).toThrow();



    });


    it("should throw an error if col is less than 0", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isVtLineClosed(0, -1);
        };

        expect(act).toThrow();


    });

    it("should throw an error if col exceeds boxCountLength-1 ", function () {

        var target,
            act;

        target = dotBox.gameEngine(config);

        act = function () {
            target.isVtLineClosed(0, config.dotCountLength);
        };

        expect(act).toThrow();

        act = function () {
            target.isVtLineClosed(0, config.dotCountLength + 1);
        };

        expect(act).toThrow();



    });


    it("should be false for all lines after construction", function () {

        var target,
            actValue,
            row,
            col,
            totalLineCount = 0;

        target = dotBox.gameEngine(config);


        for (row = 0; row < target.getBoxCountWidth(); row++) {

            for (col = 0; col < target.getDotCountLength(); col++) {

                actValue = target.isVtLineClosed(row, col);

                expect(actValue).toBe(false);

                totalLineCount += 1;

            }

        }

        expect(totalLineCount).toBe(target.getLineCountVertical());

    });



});

    */