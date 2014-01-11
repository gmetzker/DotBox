/*global createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.gameOver = function (viewContext, model) {

    //Alias
    var util = dotBox.utility;

    //Members
    //noinspection JSLint
    var that = {},
        gameOverPanel;


    //Constants
    //noinspection JSLint
    var pixelConst = viewContext.scaleAllPixelProps({
            PNL_H: 40,
            FONT_SIZE: 18
        }),
        SB_BACK_COLOR1 = '#5b5b5b',
        SB_BACK_COLOR2 = '#545454',
        SB_BORDER_COLOR = '#7d7d7d',
        SB_BORDER_COLOR2 = '#323232',
        SCORE_TXT_COLOR = 'white';



    if (util.isNullOrUndefined(viewContext)) {
        throw new Error('viewContext is null or undefined.');
    }

    if (util.isNullOrUndefined(model)) {
        throw new Error("model is null or undefined.");
    }


    viewContext.observer.subscribe('gameOver', onGameOver);
   // viewContext.observer.subscribe('dotClick', function () { onGameOver(0); });



    function onGameOver(winner) {

        var playerName = viewContext.playerNames[winner];

        addGameOverPanel(playerName);

    }


    function addGameOverPanel(playerName) {

        gameOverPanel = new createjs.Container();
        gameOverPanel.x = 0;
        gameOverPanel.y = -1 * pixelConst.PNL_H;

        addBackground(gameOverPanel);
        addText(gameOverPanel, playerName + " wins!");

        viewContext.stage.addChild(gameOverPanel);



        createjs.Tween
            .get(gameOverPanel, {override: true})
            .to({y: 0}, 200, createjs.Ease.sineIn);

    }



    function addBackground(container) {

        var tempShape,
            STROKE_SIZE = viewContext.scalePixel(1),
            width = viewContext.width();


        //Create the background shape.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR2, SB_BACK_COLOR1], [0, 1], 0, 0, 0, pixelConst.PNL_H)
            .drawRect(0, 0, width, pixelConst.PNL_H)
            .endFill();

        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, pixelConst.PNL_H - STROKE_SIZE)
            .lineTo(width, pixelConst.PNL_H - STROKE_SIZE)
            .endStroke();

        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(SB_BORDER_COLOR2)
            .moveTo(0, pixelConst.PNL_H)
            .lineTo(width, pixelConst.PNL_H)
            .endStroke();


        container.addChild(tempShape);

    }




    function addText(container, text) {

        var tempShape;

        //Add the text shape that contains the current score.
        tempShape = new createjs.Text(text, pixelConst.FONT_SIZE + "px Helvetica", SCORE_TXT_COLOR);
        tempShape.x = Math.round(viewContext.width() / 2);
        tempShape.y = Math.round(pixelConst.PNL_H / 2);
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";


        container.addChild(tempShape);

        return tempShape;
    }




    return that;

};