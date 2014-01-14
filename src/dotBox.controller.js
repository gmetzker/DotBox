var dotBox = dotBox || {};



/**
 * Creates a new controller class
 * @param   {Observer}    observer   - Used to send/receive events.
 * @param   {gameConfig}  config     - Config used to setup the game.
 * @returns {dotBox.controller}      - The controller class.
 */
dotBox.controller = function (observer, config) {


    //Alias
    var util = dotBox.utility;


    //Vars
    //noinspection JSLint
    var that,
        gameEngine,
        model = null,
        aiPlayer;

    init();

    that = {
        startGame: startGame,
        model: model
    };



    function init() {

        gameEngine = dotBox.gameEngine({
            dotCountLength: config.dotColCount,
            dotCountWidth: config.dotRowCount
        });

        assignPlayerNames();

        if (config.useAi) {
            aiPlayer = dotBox.ai.pureRandom(1, gameEngine);
        }

        model = dotBox.model(gameEngine, config);

        addSubscribers();

    }

    function startGame() {
        observer.publish('startGame', model);

        if (!util.isNullOrUndefined(config.preMovePercent)) {
            connectRandomLines(config.preMovePercent);
        }
    }


    function addSubscribers() {
        observer.subscribe('dotRollOver', onDotRollOver);

        observer.subscribe('dotRollOut', onDotRollOut);

        observer.subscribe('dotClick', onDotClick);

    }



    function onDotRollOver(dot) {


        //If there are no open lines then exit out.
        if (!gameEngine.hasAnyOpenLines(dot)) { return; }


        model.hoveredDot = dot;
        observer.publish('view.dotRollOver', dot);



    }

    function onDotRollOut(dot) {
        model.hoveredDot = null;
        observer.publish('view.dotRollOut', dot);
    }


    function connectDots(d1, d2, isInit) {

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
        observer.publish('view.lineConnected', line);

        // If any boxes scored draw them
        renderScoredBoxesToView(result.boxesScored, playerThisTurn);


        if (gameEngine.isGameOver()) {

            observer.publish("gameOver", getWinner());

        } else {

            playerNextTurn = gameEngine.getCurrentPlayer();

            if ((playerNextTurn !== null) && (playerNextTurn !== playerThisTurn)) {
                observer.publish("views.playerTurnChanged");
            }

            if (!isInit && isPlayerAi(playerNextTurn)) {
                makeAiMove(playerNextTurn);
            }

        }



    }

    function onDotClick(dot) {

        var selDot = model.selectedDot;


        if (!gameEngine.hasAnyOpenLines(dot)) { return null; }

        if (model.isSelectedDot(dot)) {

            model.selectedDot = null;
            observer.publish('view.dotSelectionChanged', selDot, null);

        } else if ((model.selectedDot !== null) && (model.canConnectDots(dot))) {

            connectDots(selDot, dot);

        } else {

            model.selectedDot = dot;
            observer.publish('view.dotSelectionChanged', selDot, dot);
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
            observer.publish('view.boxesScored', closedBoxes, playerThisTurn);
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

        connectDots(line.d1, line.d2, true);

    }

    function connectRandomLines(percent) {

        var i,
            totalLineCount,
            targetLineCount;

        if ((percent < 0) || (percent > 1)) {
            throw new Error('percent must be between 0 and 1');
        } else if (percent === 0) {
            return;
        }
        totalLineCount = gameEngine.getTotalLineCount();
        targetLineCount = Math.floor(totalLineCount * percent);


        for (i = 0; i < targetLineCount; i++) {
            connectRandomLine();
        }

        if (isPlayerAi(gameEngine.getCurrentPlayer())) {
            makeAiMove(gameEngine.getCurrentPlayer());
        }

    }

    function assignPlayerNames() {

        var finalNames = [];

        if (util.isNullOrUndefined(config.playerNames)) {
            config.playerNames = [];
        }

        if (config.playerNames.length < 1 ||
                util.isNullOrUndefined(config.playerNames[0]) ||
                config.playerNames[0].length === 0) {

            finalNames.push('PLAYER 1');


        } else {
            finalNames.push(config.playerNames[0]);
        }


        if (config.playerNames.length < 2 ||
                util.isNullOrUndefined(config.playerNames[1]) ||
                config.playerNames[1].length === 0) {

            if (config.useAi) {
                finalNames.push('HAL9000');
            } else {
                finalNames.push('PLAYER 2');
            }

        } else {
            finalNames.push(config.playerNames[1]);
        }

        config.playerNames = finalNames;

    }

    function isPlayerAi(playerIndex) {

        if (!config.useAi) { return false; }

        return playerIndex === 1;
    }

    function makeAiMove(playerIndex) {

        observer.publish("startRemoteTurn", playerIndex);
        aiPlayer.makeMove(function (move) {


            observer.publish("endRemoteTurn", playerIndex, move);
        });


    }




    return that;


};