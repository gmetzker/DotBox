var dotBox = dotBox || {};

dotBox.model = function model(gameEngine) {

    var _gameEngine = gameEngine,
        that;

    that = {

        selectedDot: null,
        hoveredDot: null,
        isSelectedDot: isSelectedDot,
        isHoveredDot: isHoveredDot,
        getDotColCount: getDotColCount,
        canConnectDots: canConnectDots,
        getDotRowCount: getDotRowCount,
        hasAnyOpenLines: hasAnyOpenLines

    };

    function getDotColCount() {
        return _gameEngine.getDotCountLength();
    }

    function getDotRowCount() {
        return _gameEngine.getDotCountWidth();
    }

    function isSelectedDot(dot) {

        if( (that.selectedDot !== null) &&
            (dot.x === that.selectedDot.x) &&
            (dot.y === that.selectedDot.y) ) {
            return true;
        } else {
            return false;
        }
    }

    function isHoveredDot(dot) {

        if( (that.hoveredDot !== null) &&
            (dot.x === that.hoveredDot.x) &&
            (dot.y === that.hoveredDot.y) ) {
            return true;
        } else {
            return false;
        }
    }

    function canConnectDots(dot) {

        if( (that.selectedDot !== null) &&
            _gameEngine.canConnectDots(that.selectedDot, dot)) {
            return true;
        } else {
            return false;
        }

    }

    function hasAnyOpenLines(dot) {
        return _gameEngine.hasAnyOpenLines(dot);
    }


    return that;

};


