
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};

dotBox.ai.pureRandom = function pureRandom(playerIndex, gameEngine) {


    var util = dotBox.utility,
        that;

    that = {
        playerIndex : playerIndex,
        makeMove: makeMove
    };


    function getRandomDot() {

        var x,
            y,
            dotColCount = gameEngine.getDotCountLength(),
            dotRowCount = gameEngine.getDotCountWidth();

        x = util.getRandom(0, dotColCount - 1);
        y = util.getRandom(0, dotRowCount - 1);

        return {
            x: x,
            y: y
        };

    }

    function getRandomOpenLine() {

        var openLines = null,
            line,
            dot;

        if (gameEngine.isGameOver()) { return null; }

        while (openLines === null) {
            dot = getRandomDot();
            openLines = gameEngine.getOpenLinesForDot(dot);
            if ((openLines !== null) && openLines.length === 0) {
                openLines = null;
            }
        }

        line = util.getRandomItem(openLines);

        return line;

    }


    function makeMove(callBack) {

        if (callBack === undefined) {
            return move();
        }

        setTimeout(function () {

            callBack(move());

        }, 10);

    }

    function move() {

        var line;
        line = getRandomOpenLine();
        return line;

    }

    return that;

};
