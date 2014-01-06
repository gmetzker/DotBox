var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.constants = {

    SCORE_BOARD_HEIGHT: 65,
    P1_COLOR: "#A4E402",
    P2_COLOR: "#BF7AFF",
    SCORE_TXT_COLOR: '#E7F8F2'

};

dotBox.views.setDrawColors = function setDrawColors(shape) {

    var fillColor = shape.fillColor,
        strokeColor = shape.strokeColor;

    if (!dotBox.utility.isNullOrUndefined(fillColor)) {
        //noinspection JSUnusedGlobalSymbols
        this.fillStyle = fillColor.toString();
    }
    if (!dotBox.utility.isNullOrUndefined(strokeColor)) {
        //noinspection JSUnusedGlobalSymbols
        this.strokeStyle = strokeColor.toString();
    }

};