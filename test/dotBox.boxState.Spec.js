/*global describe, it, expect, dotBox */


describe("dotBox.boxState", function () {

    var boxState = dotBox.boxState;

    it("can create new instance", function () {

        var dotCountLength = 4,
            dotCountWidth = 4,
            target;

        target = boxState(dotCountLength, dotCountWidth);

        expect(target).not.toBeNull();

    });

    it("getBoxCount should return 6 for a square game with 4x3 dots", function () {

        var dotCountLength = 4,
            dotCountWidth = 3,
            target;

        target = boxState(dotCountLength, dotCountWidth);

        expect(target.getBoxCount()).toBe(6);

    });

    it("isBoxScored should be true after calling scoreBox", function () {

        var i,
            j,
            dotCountLength = 4,
            dotCountWidth = 3,
            boxCount = 6,
            target,
            playerIndex = 3;

        for(i = 0; i < boxCount; i++) {

            target = boxState(dotCountLength, dotCountWidth);

            target.scoreBox(i, playerIndex);

            for(j = 0; j < boxCount; j++) {

                if( j === i ) {
                    expect(target.isBoxScored(j)).toBe(true);
                } else {
                    expect(target.isBoxScored(j)).toBe(false);
                }


            }


        }





    });

    it("isBoxUnScored should be false after calling scoreBox", function () {

        var i,
            j,
            dotCountLength = 4,
            dotCountWidth = 3,
            boxCount = 6,
            target,
            playerIndex = 3;

        for(i = 0; i < boxCount; i++) {

            target = boxState(dotCountLength, dotCountWidth);

            target.scoreBox(i, playerIndex);

            for(j = 0; j < boxCount; j++) {

                if( j === i ) {
                    expect(target.isBoxUnscored(j)).toBe(false);
                } else {
                    expect(target.isBoxUnscored(j)).toBe(true);
                }


            }


        }

    });

    it("areAllBoxesScored should return true when all boxes are scored", function () {

        var i,
            dotCountLength = 4,
            dotCountWidth = 3,
            boxCount = 6,
            target,
            playerIndex = 3;

        target = boxState(dotCountLength, dotCountWidth);

        for(i = 0; i < boxCount; i++) {

            target.scoreBox(i, playerIndex);

        }

        expect(target.areAllBoxesScored()).toBe(true);


    });

    it("areAllBoxesScored should return false if any box is not scored", function () {

        var i,
            dotCountLength = 4,
            dotCountWidth = 3,
            target,
            playerIndex = 3,
            boxCount = 6;

        target = boxState(dotCountLength, dotCountWidth);

        expect(target.areAllBoxesScored()).toBe(false);


        for(i = 0; i < boxCount; i++) {
            if( i !== 4 ) {
                target.scoreBox(i, playerIndex);
            }
        }




        expect(target.areAllBoxesScored()).toBe(false);


    });

    it("whichPlayerScoredBox should the player who scored the box", function () {

        var dotCountLength = 4,
            dotCountWidth = 3,
            target,
            playerIndex = 3,
            boxIndex = 4;

        target = boxState(dotCountLength, dotCountWidth);

        target.scoreBox(boxIndex, playerIndex);

        expect(target.whichPlayerScoredBox(boxIndex)).toBe(playerIndex);
    });

    it("whichPlayerScoredBox should return null when box is not scored", function () {

        var dotCountLength = 4,
            dotCountWidth = 3,
            target,
            playerIndex = 3,
            boxIndex = 4;

        target = boxState(dotCountLength, dotCountWidth);


        expect(target.whichPlayerScoredBox(boxIndex)).toBeNull();
    });

});