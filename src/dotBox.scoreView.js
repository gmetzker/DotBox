var dotBox = dotBox || {};

dotBox.scoreView = function(events) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.viewConst;

    //Members
    var that = {},
        _model,
        _stage,
        _scoreTxtShapes = []
        _playerFlagShapes = [];


    //Constants
    var SB_BACK_COLOR1 = '#5b5b5b',
        SB_BACK_COLOR2 = '#545454',
        SB_BORDER_COLOR = '#7d7d7d',
        SCORE_NUM_BACK_COLOR = '#272822'
        SCORE_NUM_BORDER_COLOR = '#3b3d38',
        SCORE_TXT_COLOR = '#e7f8f2',
        FLAG_COLOR = '#fc1f70',
        FLAG_BORDER_COLOR = '#E20355';


    addSubscribers();



    function addSubscribers() {

        events.subscribe('view.stageInit', onStageInit);

        events.subscribe('view.boxesScored', onBoxesScored);

        events.subscribe('views.playerTurnChanged', onPlayerTurnChanged);

    }

    function onStageInit(stage, model) {


        if(util.isNullOrUndefined(stage)) {
            throw new Error('stage is null or undefined.')
        } else {
            _stage = stage;
        }

        if(util.isNullOrUndefined(model)) {
            throw new Error("model is null or undefined.")
        } else {
            _model = model;
        }

        drawScoreBoard();

    }

    function onBoxesScored(scoredBoxes){

        var i,
            playerScores;

        playerScores = _model.getCurrentScores();

        for(i = 0; i < playerScores.length; i++) {
            _scoreTxtShapes[i].text = playerScores[i];
        }

    }

    function onPlayerTurnChanged() {
        setCurrentPlayerShape();
    }



    function drawScoreBoard() {

        var rectShape,
            lineShape,
            sbTop,
            tempShape,
            boxMargin,
            boxW,
            boxH,
            boxT,
            boxL,
            tempTxt,
            playerFlagShape;

        _scoreTxtShapes = [];
        _playerFlagShapes = [];

        sbTop = _stage.canvas.height - viewConst.SCORE_BOARD_HEIGHT;

        rectShape = new createjs.Shape();
        rectShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR1, SB_BACK_COLOR2], [0, 1], 0, sbTop, 0, _stage.canvas.height)
            .drawRect(0, sbTop, _stage.canvas.width, _stage.canvas.height)
            .endFill();

        _stage.addChild(rectShape);

        lineShape = new createjs.Shape();


        lineShape.graphics
            .setStrokeStyle(1)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, sbTop)
            .lineTo(_stage.canvas.width, sbTop);

        _stage.addChild(lineShape);



        //Add score box for player-0
        boxMargin = 5;
        boxL = 10;
        boxT = sbTop + boxMargin + 1;
        boxW = 75;
        boxH = viewConst.SCORE_BOARD_HEIGHT - (2 * boxMargin);

        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginStroke(SCORE_NUM_BORDER_COLOR)
            .beginFill(SCORE_NUM_BACK_COLOR)
            .drawRoundRect(boxL, boxT, boxW, boxH, 3);

        _stage.addChild(tempShape);

        tempTxt = new createjs.Text("0", "25px Helvetica", SCORE_TXT_COLOR);
        tempTxt.x = boxL + boxW / 2;
        tempTxt.y = 1 + boxT + boxH / 2;
        tempTxt.textAlign = "center";
        tempTxt.textBaseline = "middle";

        _stage.addChild(tempTxt);
        _scoreTxtShapes.push(tempTxt);



        playerFlagShape = new createjs.Shape();
        playerFlagShape.graphics
            .beginFill(FLAG_COLOR)
            .beginStroke(FLAG_BORDER_COLOR)
            .arc(boxL + (boxW / 2), boxT + boxH + 12, boxW / 4, Math.PI + (Math.PI *.25), Math.PI * 1.75);

        _playerFlagShapes.push(playerFlagShape);


        playerFlagShape.alpha = 0;

        _stage.addChild(playerFlagShape);


        //Add score box for player-1
        boxMargin = 5;
        boxW = 75;
        boxL = _stage.canvas.width - 10 - boxW;
        boxT = sbTop + boxMargin + 1;
        boxH = viewConst.SCORE_BOARD_HEIGHT - (2 * boxMargin);

        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginStroke(SCORE_NUM_BORDER_COLOR)
            .beginFill(SCORE_NUM_BACK_COLOR)
            .drawRoundRect(boxL, boxT, boxW, boxH, 3);

        _stage.addChild(tempShape);

        tempTxt = new createjs.Text("0", "25px Helvetica", SCORE_TXT_COLOR);
        tempTxt.x = boxL + boxW / 2;
        tempTxt.y = 1 + boxT + boxH / 2;
        tempTxt.textAlign = "center";
        tempTxt.textBaseline = "middle";

        _stage.addChild(tempTxt);
        _scoreTxtShapes.push(tempTxt);

        playerFlagShape = new createjs.Shape();
        playerFlagShape.graphics
            .beginFill(FLAG_COLOR)
            .beginStroke(FLAG_BORDER_COLOR)
            .arc(boxL + (boxW / 2), boxT + boxH + 12, boxW / 4, Math.PI + (Math.PI *.25), Math.PI * 1.75);

        _playerFlagShapes.push(playerFlagShape);

        playerFlagShape.alpha = 0;

        _stage.addChild(playerFlagShape);

        setCurrentPlayerShape();

    }



    function setCurrentPlayerShape() {

        var i,
            tempShape,
            playerIdx = _model.getCurrentPlayer();

        for(i = 0; i < _playerFlagShapes.length; i++) {


            tempShape = _playerFlagShapes[i];
            if(i === playerIdx) {

                if(tempShape.alpha === 0) {
                    createjs.Tween.get(tempShape, {override: false}).to({alpha: 1.0}, 250, createjs.Ease.signIn);
                }

            } else {
                createjs.Tween.get(tempShape, {override: false}).to({alpha: 0}, 250, createjs.Ease.signOut);
            }

        }

    }


    return that;

};