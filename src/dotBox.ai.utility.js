
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};
dotBox.ai.utility = dotBox.ai.utility || {};

dotBox.ai.utility.findCloseableBoxes = function (gameEngine) {

    var results = [],
        boxIndex,
        boxCount = gameEngine.getBoxCount(),
        lineStates;


    for (boxIndex = 0; boxIndex < boxCount; boxIndex++) {

        if (!gameEngine.isBoxScored(boxIndex)) {

            lineStates = gameEngine.getLineStatesForBox(boxIndex);

            if (lineStates.open.length === 1) {

                console.log('CloseableBox @ ' + boxIndex);
                results.push({
                    boxIndex: boxIndex,
                    openLine: lineStates.open[0]
                });

            }

        }

    }

    return results;

};