
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};


dotBox.ai.SingleBoxCloser = function SingleBoxCloser() {
    dotBox.ai.AiPlayer.apply(this, arguments);
};

dotBox.ai.SingleBoxCloser.prototype = new dotBox.ai.AiPlayer();

dotBox.ai.SingleBoxCloser.prototype.move = function move() {

    var closeableBoxes,
        rndClosedBox;

    closeableBoxes = dotBox.ai.utility.findCloseableBoxes(this.gameEngine);

    if (closeableBoxes.length > 0) {

        rndClosedBox = dotBox.utility.getRandomItem(closeableBoxes);
        return rndClosedBox.openLine;

    }

    return this.getRandomOpenLine();

};



