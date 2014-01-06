var dotBox = dotBox || {};

dotBox.model = function model(gameEngine) {

    var that;

    that = {

        selectedDot: null,
        hoveredDot: null,
        isSelectedDot: isSelectedDot,
        isHoveredDot: isHoveredDot,
        getDotColCount: getDotColCount,
        canConnectDots: canConnectDots,
        getDotRowCount: getDotRowCount,
        hasAnyOpenLines: hasAnyOpenLines,
        getCurrentScores: getCurrentScores,
        getCurrentPlayer: getCurrentPlayer

    };

    function getDotColCount() {
        return gameEngine.getDotCountLength();
    }

    function getDotRowCount() {
        return gameEngine.getDotCountWidth();
    }

    function isSelectedDot(dot) {

        return (that.selectedDot !== null) &&
            (dot.x === that.selectedDot.x) &&
            (dot.y === that.selectedDot.y);
    }

    function isHoveredDot(dot) {

        return (that.hoveredDot !== null) &&
            (dot.x === that.hoveredDot.x) &&
            (dot.y === that.hoveredDot.y);
    }

    function canConnectDots(dot) {

        return (that.selectedDot !== null) &&
            gameEngine.canConnectDots(that.selectedDot, dot);

    }

    function hasAnyOpenLines(dot) {
        return gameEngine.hasAnyOpenLines(dot);
    }

    function getCurrentScores() {
        return gameEngine.getCurrentScores();
    }

    function getCurrentPlayer() {
        return gameEngine.getCurrentPlayer();
    }


    return that;

};


