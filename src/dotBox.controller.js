var dotBox = dotBox || {};

dotBox.controller = function (events) {


    //Alias
    var util = dotBox.utility;

    //Constants
    var DOT_COL_COUNT = 15,
        DOT_ROW_COUNT = 10;

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
            line;

        line = {d1: d1, d2: d2};
        result = gameEngine.connectLine(line);




        //Draw the connected line
        _model.selectedDot = null;
        _model.hoveredDot = null;
        _events.publish('view.lineConnected', line);

        // If any boxes scored draw them
        renderScoredBoxesToView(result.boxesScored);




        //TODO:
        //3.  If any boxes scored fire scored changed.
        //4.  If game over announce winner.
        //5.  If game NOT OVER
        //5b)   If player is different --> fire player changed.

    }

    function renderScoredBoxesToView(scoredBoxes) {

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
            _events.publish('view.boxesScored', closedBoxes);
        }

    }

    return that;


};