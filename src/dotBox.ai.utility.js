
var dotBox = dotBox || {};
dotBox.ai = dotBox.ai || {};
dotBox.ai.utility = dotBox.ai.utility || {};

(function (namespace) {

    var util = dotBox.utility;
//        itUtil = dotBox.utility.iterators;

    function findCloseableBoxes(gameEngine) {

        var results = [],
            boxIndex,
            boxCount = gameEngine.getBoxCount(),
            lineStates;


        for (boxIndex = 0; boxIndex < boxCount; boxIndex++) {

            if (!gameEngine.isBoxScored(boxIndex)) {

                lineStates = gameEngine.getLineStatesForBox(boxIndex);

                if (lineStates.open.length === 1) {

                    results.push({
                        boxIndex: boxIndex,
                        openLine: lineStates.open[0]
                    });

                }

            }

        }


        return results;

    }

    function boxHasThreeOrMoreOpen(boxIndex, gameEngine) {

        var lineStates;

        lineStates = gameEngine.getLineStatesForBox(boxIndex);

        return lineStates.open.length >= 3;

    }

    function getAllOpenLines(gameEngine) {

        var allOpen = [],
            iterator,
            itAndAddIfOpen;



        itAndAddIfOpen = function (it) {
            var line;

            //noinspection JSHint,JSLint
            while (line = it.next()) {

                if (!gameEngine.isLineConnected(line)) {
                    allOpen.push(line);
                }
            }

        };

        iterator = itUtil.hLineIterator(gameEngine.getDotCountLength(), gameEngine.getDotCountWidth());
        itAndAddIfOpen(iterator);

        iterator = itUtil.vLineIterator(gameEngine.getDotCountLength(), gameEngine.getDotCountWidth());
        itAndAddIfOpen(iterator);


        return allOpen;
    }

    function findNonThirdSideLines(gameEngine) {

        var i,
            allOpen,
            adjacentBoxes,
            line,
            dotL = gameEngine.getDotCountLength(),
            dotW = gameEngine.getDotCountWidth(),
            resultLines = [],
            boxIsWideOpen;

        allOpen = getAllOpenLines(gameEngine);

        boxIsWideOpen = function (bIndex) {
            return boxHasThreeOrMoreOpen(bIndex, gameEngine);
        };

        for (i = 0; i < allOpen.length; i++) {
            line = allOpen[i];
            adjacentBoxes = util.line.getBoxesFromLine(line, dotL, dotW);

            if (adjacentBoxes.every(boxIsWideOpen)) {
                resultLines.push(line);
            }
        }

        return resultLines;

    }

    namespace.findCloseableBoxes = findCloseableBoxes;
    namespace.boxHasThreeOrMoreOpen = boxHasThreeOrMoreOpen;
    namespace.getAllOpenLines = getAllOpenLines;
    namespace.findNonThirdSideLines = findNonThirdSideLines;


}(dotBox.ai.utility));


