
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};

dotBox.ai.AiPlayer = function AiPlayer(playerIndex, gameEngine) {

    if (!(this instanceof AiPlayer)) {
        //Pass arguments to this constructor.
        return AiPlayer.apply(new AiPlayer(), arguments);
    }

    //noinspection JSUnusedGlobalSymbols
    this.playerIndex = playerIndex;
    this.gameEngine = gameEngine;

};

dotBox.ai.AiPlayer.prototype = (function () {

    var util = dotBox.utility;

    function getRandomDot() {

        var x,
            y;

        x = util.getRandom(0, this.gameEngine.getDotCountLength() - 1);
        y = util.getRandom(0, this.gameEngine.getDotCountWidth() - 1);

        return {
            x: x,
            y: y
        };

    }

    function getRandomOpenLine() {

        var openLines = null,
            line,
            dot;

        if (this.gameEngine.isGameOver()) { return null; }

        while (openLines === null) {
            dot = this.getRandomDot();
            openLines = this.gameEngine.getOpenLinesForDot(dot);
            if ((openLines !== null) && openLines.length === 0) {
                openLines = null;
            }
        }

        line = util.getRandomItem(openLines);

        return line;

    }

    function move() {

        var line;
        line = this.getRandomOpenLine();
        return line;

    }

    function makeMove(callBack) {

        var that = this;

        if (callBack === undefined) {
            return this.move();
        }

        setTimeout(function () {

            callBack(that.move());

        }, 10);

    }


    return {
        getRandomDot: getRandomDot,
        getRandomOpenLine: getRandomOpenLine,
        move: move,
        makeMove: makeMove
    };

}());






