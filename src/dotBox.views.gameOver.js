/*global createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.gameOver = function (events) {

    //Alias
    var util = dotBox.utility;

    //Members
    //noinspection JSLint
    var that = {},
        _model,
        _stage,
        _gameOverPanel;


    //Constants
    //noinspection JSLint
    var PNL_H = 40,
        SB_BACK_COLOR1 = '#5b5b5b',
        SB_BACK_COLOR2 = '#545454',
        SB_BORDER_COLOR = '#7d7d7d',
        SB_BORDER_COLOR2 = '#323232',
        SCORE_TXT_COLOR = 'white';



    events.subscribe('view.stageInit', onStageInit);

    events.subscribe('gameOver', onGameOver);


    function onStageInit(stage, model) {


        if (util.isNullOrUndefined(stage)) {
            throw new Error('stage is null or undefined.');
        } else {
            _stage = stage;
        }

        if (util.isNullOrUndefined(model)) {
            throw new Error("model is null or undefined.");
        } else {
            _model = model;
        }


    }


    function onGameOver(winner) {

        var playerName = "Player " + (winner + 1);

        addGameOverPanel(playerName);

    }


    function addGameOverPanel(playerName) {

        _gameOverPanel = new createjs.Container();
        _gameOverPanel.x = 0;
        _gameOverPanel.y = -1 * PNL_H;

        addBackground(_gameOverPanel);
        addText(_gameOverPanel, playerName + " wins!");

        _stage.addChild(_gameOverPanel);



        createjs.Tween.get(_gameOverPanel, {override: true}).to({y: 0}, 200, createjs.Ease.sineIn);

    }



    function addBackground(container) {

        var tempShape;


        //Create the background shape.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR2, SB_BACK_COLOR1], [0, 1], 0, 0, 0, PNL_H)
            .drawRect(0, 0, _stage.canvas.width, PNL_H)
            .endFill();

        tempShape.graphics
            .setStrokeStyle(1)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, PNL_H - 1)
            .lineTo(_stage.canvas.width, PNL_H - 1)
            .endStroke();

        tempShape.graphics
            .setStrokeStyle(1)
            .beginStroke(SB_BORDER_COLOR2)
            .moveTo(0, PNL_H)
            .lineTo(_stage.canvas.width, PNL_H)
            .endStroke();






        container.addChild(tempShape);

    }




    function addText(container, text) {

        var tempShape;

        //Add the text shape that contains the current score.
        tempShape = new createjs.Text(text, "16pt Helvetica", SCORE_TXT_COLOR);
        tempShape.x = Math.round(_stage.canvas.width / 2);
        tempShape.y = Math.round(PNL_H / 2);
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";


        container.addChild(tempShape);

        return tempShape;
    }




    return that;

};