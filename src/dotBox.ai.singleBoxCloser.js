var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};

dotBox.ai.singleBoxCloser = function singleBoxCloser(playerIndex, gameEngine) {


    var util = dotBox.utility,
        aiUtil = dotBox.ai.utility,
        that,
        pureRandom = dotBox.ai.pureRandom(playerIndex, gameEngine);

    that = {
        playerIndex : playerIndex,
        makeMove: makeMove
    };


    function makeMove(callBack) {

        if (callBack === undefined) {
            return move();
        }

        setTimeout(function () {

            callBack(move());

        }, 10);

    }

    function move() {

        var closeableBoxes,
            rndClosedBox;

        closeableBoxes = aiUtil.findCloseableBoxes(gameEngine);

        if (closeableBoxes.length > 0) {

            rndClosedBox = util.getRandomItem(closeableBoxes);
            return rndClosedBox.openLine;

        }

        return pureRandom.makeMove();

    }


    return that;

};


