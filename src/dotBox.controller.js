var dotBox = dotBox || {};

dotBox.controller = function (events) {


    //Alias
    var util = dotBox.utility;

    //Constants
    //noinspection JSLint
    var DOT_COL_COUNT = 6,
        DOT_ROW_COUNT = 6;

    //Vars
    //noinspection JSLint
    var that,
        gameEngine,
        model;



    gameEngine = dotBox.gameEngine({
        dotCountLength: DOT_COL_COUNT,
        dotCountWidth: DOT_ROW_COUNT
    });

    model = dotBox.model(gameEngine);

    addSubscribers();


    that = {
        startGame: startGame,
        model: model
    };

    function startGame() {
        events.publish('startGame', model);

        //connectRandomLines(0.98);
    }


    function addSubscribers() {
        events.subscribe('dotRollOver', onDotRollOver);

        events.subscribe('dotRollOut', onDotRollOut);

        events.subscribe('dotClick', onDotClick);
    }



    function onDotRollOver(dot) {


        //If there are no open lines then exit out.
        if (!gameEngine.hasAnyOpenLines(dot)) { return; }


        model.hoveredDot = dot;
        events.publish('view.dotRollOver', dot);



    }

    function onDotRollOut(dot) {
        model.hoveredDot = null;
        events.publish('view.dotRollOut', dot);
    }


    function connectDots(d1, d2) {

        var result,
            line,
            playerThisTurn,
            playerNextTurn;


        playerThisTurn = gameEngine.getCurrentPlayer();

        line = {d1: d1, d2: d2};
        result = gameEngine.connectLine(line);




        //Draw the connected line
        model.selectedDot = null;
        model.hoveredDot = null;
        events.publish('view.lineConnected', line);

        // If any boxes scored draw them
        renderScoredBoxesToView(result.boxesScored, playerThisTurn);


        if (gameEngine.isGameOver()) {

            events.publish("gameOver", getWinner());

        } else {

            playerNextTurn = gameEngine.getCurrentPlayer();

            if ((playerNextTurn !== null) && (playerNextTurn !== playerThisTurn)) {
                events.publish("views.playerTurnChanged");
            }

        }



    }

    function onDotClick(dot) {

        var selDot = model.selectedDot;


        if (!gameEngine.hasAnyOpenLines(dot)) { return null; }

        if (model.isSelectedDot(dot)) {

            model.selectedDot = null;
            events.publish('view.dotSelectionChanged', selDot, null);

        } else if ((model.selectedDot !== null) && (model.canConnectDots(dot))) {

            connectDots(selDot, dot);

        } else {

            model.selectedDot = dot;
            events.publish('view.dotSelectionChanged', selDot, dot);
        }


    }

    function getWinner() {

        var i,
            playerWithMax = 0,
            maxScore = 0,
            scores;

        scores = model.getCurrentScores();

        for (i = 0; i < scores.length; i++) {
            if (scores[i] >= maxScore) {
                maxScore = scores[i];
                playerWithMax = i;
            }
        }

        return playerWithMax;

    }

    function renderScoredBoxesToView(scoredBoxes, playerThisTurn) {

        var i,
            closedBoxes,
            boxIdx;

        if (scoredBoxes.length > 0) {

            closedBoxes = [];
            for (i = 0; i < scoredBoxes.length; i++) {
                boxIdx = scoredBoxes[i];
                closedBoxes.push({
                    box: boxIdx,
                    lines: util.line.getLinesFromBox(boxIdx, gameEngine.getDotCountLength())
                });

            }
            events.publish('view.boxesScored', closedBoxes, playerThisTurn);
        }

    }


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

        if (gameEngine.isGameOver()) { return; }

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

    function connectRandomLine() {

        var line = getRandomOpenLine();

        if (util.isNullOrUndefined(line)) { return; }

        connectDots(line.d1, line.d2);

    }

    function connectRandomLines(percent) {

        var i,
            totalLineCount,
            targetLineCount;

        if ((percent < 0) || (percent > 1)) {
            throw new Error('percent must be between 0 and 1');
        }
        totalLineCount = gameEngine.getTotalLineCount();
        targetLineCount = Math.floor(totalLineCount * percent);


        for (i = 0; i < targetLineCount; i++) {
            connectRandomLine();
        }

    }



    return that;


};