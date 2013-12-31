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

        _events.subscribe('dotRollOver', function(dot) {
            _model.hoveredDot = dot;
            _events.publish('view.dotRollOver', dot);
        });

        _events.subscribe('dotRollOut', function(dot) {
            _model.hoveredDot = null;
            _events.publish('view.dotRollOut', dot);
        });

        _events.subscribe('dotClick', onDotClick);

    }

    function onDotClick(dot) {

        var oldDot = _model.selectedDot;

        if( _model.isSelectedDot(dot) ) {
            _model.selectedDot = null;
        } else {
            _model.selectedDot = dot;
        }

        _events.publish('view.dotSelectionChanged', oldDot, dot);

    }

    return that;


};