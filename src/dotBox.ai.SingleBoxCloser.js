
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};


dotBox.ai.SingleBoxCloser = (function () {

    var util = dotBox.utility,
        SingleBoxCloser;

    SingleBoxCloser = function SingleBoxCloser(playerIndex, gameEngine) {

        if (!(this instanceof SingleBoxCloser)) {
            //Pass arguments to this constructor.
            return SingleBoxCloser.apply(new SingleBoxCloser(), arguments);
        }

        //noinspection JSUnusedGlobalSymbols
        this.playerIndex = playerIndex;
        this.gameEngine = gameEngine;
    };

    util.inherit(SingleBoxCloser, dotBox.ai.AvoidThirdSide);

    SingleBoxCloser.prototype.move = function move() {

        var closeableBoxes,
            rndClosedBox;

        closeableBoxes = dotBox.ai.utility.findCloseableBoxes(this.gameEngine);

        if (closeableBoxes.length > 0) {

            rndClosedBox = util.getRandomItem(closeableBoxes);
            return rndClosedBox.openLine;

        }

        return SingleBoxCloser.uber.move.apply(this);

    };

    return SingleBoxCloser;

}());