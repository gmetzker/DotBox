
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};


dotBox.ai.AvoidThirdSide = (function () {

    var util = dotBox.utility,
        aiUtil = dotBox.ai.utility,
        AvoidThirdSide;

    AvoidThirdSide = function AvoidThirdSide(playerIndex, gameEngine) {

        if (!(this instanceof AvoidThirdSide)) {
            //Pass arguments to this constructor.
            return AvoidThirdSide.apply(new AvoidThirdSide(), arguments);
        }

        //noinspection JSUnusedGlobalSymbols
        this.playerIndex = playerIndex;
        this.gameEngine = gameEngine;

    };

    util.inherit(AvoidThirdSide, dotBox.ai.AiPlayer);


    AvoidThirdSide.prototype.move = function move() {

        var nonThirdSideLines,
            rndLine;

        nonThirdSideLines = aiUtil.findNonThirdSideLines(this.gameEngine);

        if (nonThirdSideLines.length > 0) {

            rndLine = util.getRandomItem(nonThirdSideLines);
            return rndLine;

        }

        return AvoidThirdSide.uber.move.apply(this);

    };

    return AvoidThirdSide;

}());




