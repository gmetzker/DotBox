var dotBox = dotBox || {};

dotBox.model = function model(gameEngine) {

    var util = dotBox.utility,
        that;

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

        return (that.selectedDot !== null) && util.areSameDot(dot, that.selectedDot);
    }

    function isHoveredDot(dot) {

        return (that.hoveredDot !== null) && util.areSameDot(dot, that.hoveredDot);
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


