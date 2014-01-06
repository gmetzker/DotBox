/*global createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.score = function (events) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.views.constants,
        Color = dotBox.views.Color;

    //Members
    //noinspection JSLint
    var that = {},
        _model,
        _stage,
        _scoreTxtShapes = [],
        _playerFlagShapes = [],
        _playerBg = [],
        _playerNameShapes = [];


    //Constants
    //noinspection JSLint
    var SB_BACK_COLOR1 = '#5b5b5b',
        SB_BACK_COLOR2 = '#545454',
        SB_BORDER_COLOR = '#7d7d7d',
        SB_BORDER_COLOR2 = '#323232',
        SCORE_NUM_BACK_COLOR = '#272822',
        SCORE_NUM_BORDER_COLOR = '#3b3d38',
        P_NON_TURN_TXT_COLOR = '#a69b9d',
        FLAG_COLOR = '#fc1f70',
        FLAG_BORDER_COLOR = '#E20355',
        P_NON_TURN_COLOR = '#40403d',
        SCORE_BOX_W = 75,
        SCORE_BOX_TOP_MARGIN = 5,
        SCORE_BOX_SIDE_MARGIN = 10,
        SCORE_BOX_H = viewConst.SCORE_BOARD_HEIGHT - (2 * SCORE_BOX_TOP_MARGIN),
        SCORE_FONT_SIZE = 25,
        P_NAME_FONT_SIZE = 10,
        P_NAME_TOP = 9,
        P_SCORE_TOP_PAD = 6,
        P_FLAG_PAD = 13;


    addSubscribers();

    function addSubscribers() {

        events.subscribe('view.stageInit', onStageInit);

        events.subscribe('view.boxesScored', onBoxesScored);

        events.subscribe('views.playerTurnChanged', onPlayerTurnChanged);

    }

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

        setPixelRatios(model.pixelRatio);

        drawScoreBoard();

    }

    function setPixelRatios(ratio) {

        SCORE_BOX_W *= ratio;
        SCORE_BOX_H *= ratio;
        SCORE_BOX_TOP_MARGIN *= ratio;
        SCORE_BOX_SIDE_MARGIN *= ratio;
        SCORE_FONT_SIZE *= ratio;
        P_NAME_FONT_SIZE *= ratio;
        P_NAME_TOP *= ratio;
        P_SCORE_TOP_PAD *= ratio;
        P_FLAG_PAD *= ratio;
    }


    function scalePixelValue(value) {

        return value * _model.pixelRatio;
    }


    function onBoxesScored() {

        var i,
            playerScores;

        playerScores = _model.getCurrentScores();

        for (i = 0; i < playerScores.length; i++) {
            _scoreTxtShapes[i].text = playerScores[i];
        }

    }

    function onPlayerTurnChanged() {
        setCurrentPlayerShape();
    }



    function drawScoreBoard() {

        var scoreBox,
            BOARD_TOP,
            SCORE_BOX_TOP,
            NAME_PREFIX = "PLAYER ";

        BOARD_TOP = _stage.canvas.height - viewConst.SCORE_BOARD_HEIGHT;
        SCORE_BOX_TOP = BOARD_TOP + SCORE_BOX_TOP_MARGIN + 1;

        _scoreTxtShapes = [];
        _playerFlagShapes = [];
        _playerBg = [];
        _playerNameShapes = [];

        addScoreboardBackground(BOARD_TOP);

        //Player-1
        scoreBox = addPlayerScoreBox(NAME_PREFIX + '1');
        scoreBox.x = SCORE_BOX_SIDE_MARGIN;
        scoreBox.y = SCORE_BOX_TOP;
        _stage.addChild(scoreBox);


        //Player-2
        scoreBox = addPlayerScoreBox(NAME_PREFIX + '2');
        scoreBox.x = _stage.canvas.width - SCORE_BOX_SIDE_MARGIN - SCORE_BOX_W;
        scoreBox.y = SCORE_BOX_TOP;
        _stage.addChild(scoreBox);



        setCurrentPlayerShape();

    }

    function addScoreboardBackground(top) {

        var tempShape,
            strokeSize = scalePixelValue(1);


            //Create the background shape.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR1, SB_BACK_COLOR2], [0, 1], 0, top, 0, _stage.canvas.height)
            .drawRect(0, top, _stage.canvas.width, _stage.canvas.height)
            .endFill();




        //Create the top border line.



        tempShape.graphics
            .setStrokeStyle(strokeSize)
            .beginStroke(SB_BORDER_COLOR2)
            .moveTo(0, top)
            .lineTo(_stage.canvas.width, top)
            .endStroke();


        tempShape.graphics
            .setStrokeStyle(strokeSize)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, top + strokeSize)
            .lineTo(_stage.canvas.width, top + strokeSize)
            .endStroke();



        _stage.addChild(tempShape);

    }

    // Creates a new player score container
    function addPlayerScoreBox(name) {

        var container = new createjs.Container(),
            tempShape,
            strokeSize = scalePixelValue(1);


        //Add the background rectangle.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .setStrokeStyle(strokeSize)
            .beginStroke(SCORE_NUM_BORDER_COLOR)
            .beginFill(SCORE_NUM_BACK_COLOR)
            .drawRoundRect(0, 0, SCORE_BOX_W, SCORE_BOX_H, scalePixelValue(2));

        container.addChild(tempShape);



        //Add the text shape that contains the current score.
        tempShape = new createjs.Text("0", SCORE_FONT_SIZE + "px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = SCORE_BOX_W / 2;
        tempShape.y = P_SCORE_TOP_PAD + (SCORE_BOX_H / 2);
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        container.addChild(tempShape);
        _scoreTxtShapes.push(tempShape);



        //Add the flag that indicates when it's the players turn.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .setStrokeStyle(strokeSize)
            .beginFill(FLAG_COLOR)
            .beginStroke(FLAG_BORDER_COLOR)
            .arc((SCORE_BOX_W / 2), SCORE_BOX_H + P_FLAG_PAD, SCORE_BOX_W / 4, Math.PI + (Math.PI * 0.25), Math.PI * 1.75);

        tempShape.alpha = 0;

        _playerFlagShapes.push(tempShape);
        container.addChild(tempShape);



        tempShape = new createjs.Shape();
        drawPlayerBackground(tempShape);

        container.addChild(tempShape);
        _playerBg.push(tempShape);

        //Add player name
        tempShape = new createjs.Text(name, P_NAME_FONT_SIZE + "px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = SCORE_BOX_W / 2;
        tempShape.y = P_NAME_TOP;
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        _playerNameShapes.push(tempShape);
        container.addChild(tempShape);


        return container;
    }

    function setCurrentPlayerShape() {

        var i,
            tempShape,
            playerIdx = _model.getCurrentPlayer(),
            nameTxtColor,
            targetFillColor,
            targetStrokeColor,
            lightShape;

        for (i = 0; i < _playerFlagShapes.length; i++) {


            tempShape = _playerFlagShapes[i];
            if (i === playerIdx) {

                if (tempShape.alpha === 0) {
                    createjs.Tween.get(tempShape, {override: false}).to({alpha: 1.0}, 250, createjs.Ease.sineIn);
                }
                nameTxtColor = viewConst.SCORE_TXT_COLOR;
            } else {
                createjs.Tween.get(tempShape, {override: false}).to({alpha: 0}, 250, createjs.Ease.sineOut);
                nameTxtColor = P_NON_TURN_TXT_COLOR;
            }


            lightShape = _playerBg[i];
            targetFillColor = getPlayerColor('fill', i, playerIdx);
            targetStrokeColor = getPlayerColor('stroke', i, playerIdx);

            createjs.Tween
                .get(lightShape.fillColor, {override: true})
                .to(targetFillColor, 200);

            createjs.Tween
                .get(lightShape.strokeColor, {override: true})
                .to(targetStrokeColor, 200);



            _playerNameShapes[i].color = nameTxtColor;
        }

    }



    function getPlayerColor(colorType, forPlayer, playerOfTurn) {

        var isCurrPlayer = (forPlayer === playerOfTurn),
            resultColor;


        if (isCurrPlayer) {

            if (forPlayer === 0) {
                resultColor = new Color(viewConst.P1_COLOR);
            } else {
                resultColor = new Color(viewConst.P2_COLOR);
            }

            if (colorType === 'fill') { resultColor.alpha = 0.33; }


        } else {
            resultColor = new Color(P_NON_TURN_COLOR);
        }

        return resultColor;

    }


    function drawPlayerBackground(shape) {

        var height = Math.round(SCORE_BOX_H * 0.3);

        //Set custom color objects so we can Tween these.
        shape.fillColor = new Color(P_NON_TURN_COLOR);
        shape.strokeColor = new Color(P_NON_TURN_COLOR);

        shape.graphics
            .setStrokeStyle(scalePixelValue(2))
            .beginStroke(P_NON_TURN_COLOR)
            .beginFill(P_NON_TURN_COLOR)
            .inject(dotBox.views.setDrawColors, shape)
            .drawRoundRect(0, 0, SCORE_BOX_W, height, scalePixelValue(2))
            .endFill();


    }




    return that;

};