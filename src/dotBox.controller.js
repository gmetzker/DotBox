var dotBox = dotBox || {};

dotBox.controller = function (events) {


    //Alias
    var util = dotBox.utility;

    //Constants
    var DOT_COL_COUNT = 6,
        DOT_ROW_COUNT = 6;

    //Vars
    var that = {},
        gameEngine,
        model;

    var _model,
        _events = events;



    gameEngine = dotBox.gameEngine({
        dotCountLength: DOT_COL_COUNT,
        dotCountWidth: DOT_ROW_COUNT
    });

    _model = dotBox.model(gameEngine);

    addSubscribers();




    that.startGame = function startGame() {
        _events.publish('startGame', _model);
    }

    function addSubscribers() {

        _events.subscribe('dotRollOver', onDotRollOver);

        _events.subscribe('dotRollOut', onDotRollOut);

        _events.subscribe('dotClick', onDotClick);

    }

    function onDotRollOver(dot) {

        var selDot = _model.selectedDot;

        //If there are no open lines then exit out.
        if(!gameEngine.hasAnyOpenLines(dot)) return;


        _model.hoveredDot = dot;
        _events.publish('view.dotRollOver', dot);



    }

    function onDotRollOut(dot) {
        _model.hoveredDot = null;
        _events.publish('view.dotRollOut', dot);
    }

    function onDotClick(dot) {

        var selDot = _model.selectedDot;


        if(!gameEngine.hasAnyOpenLines(dot)) { return; }

        if( _model.isSelectedDot(dot) ) {

            _model.selectedDot = null;
            _events.publish('view.dotSelectionChanged', selDot, null);

        } else if((_model.selectedDot !== null) && (_model.canConnectDots(dot))) {

            connectDots(selDot, dot);

        } else {

            _model.selectedDot = dot;
            _events.publish('view.dotSelectionChanged', selDot, dot);
        }


    }

    function connectDots(d1, d2) {

        var boxIdx,
            result,
            line,
            playerThisTurn,
            playerNextTurn;


        playerThisTurn = gameEngine.getCurrentPlayer();

        line = {d1: d1, d2: d2};
        result = gameEngine.connectLine(line);




        //Draw the connected line
        _model.selectedDot = null;
        _model.hoveredDot = null;
        _events.publish('view.lineConnected', line);

        // If any boxes scored draw them
        renderScoredBoxesToView(result.boxesScored, playerThisTurn);


        if(gameEngine.isGameOver()) {

            _events.publish("gameOver", getWinner());

        } else {

            playerNextTurn = gameEngine.getCurrentPlayer();

            if((playerNextTurn !== null) && (playerNextTurn !== playerThisTurn)) {
                _events.publish("views.playerTurnChanged");
            }

        }



    }

    function getWinner() {

        var i,
            playerWithMax = 0,
            maxScore = 0,
            scores;

        scores = _model.getCurrentScores();

        for(i = 0; i < scores.length; i++) {
            if(scores[i] >= maxScore) {
                maxScore = scores[i];
                playerWithMax = i;
            }
        }

        return playerWithMax;

    }

    function renderScoredBoxesToView(scoredBoxes, playerThisTurn) {

        var i,
            closedBoxes;

        if( scoredBoxes.length > 0) {

            closedBoxes = [];
            for(i=0; i < scoredBoxes.length; i++){
                boxIdx = scoredBoxes[i]
                closedBoxes.push({
                    box: boxIdx,
                    lines: util.line.getLinesFromBox(boxIdx, gameEngine.getDotCountLength())
                });

            }
            _events.publish('view.boxesScored', closedBoxes, playerThisTurn);
        }

    }

    return that;


};