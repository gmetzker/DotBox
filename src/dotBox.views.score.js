var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.score = function(events) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.views.const;

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

        var scoreBox,
            BOARD_TOP,
            BOX_TOP_MARGIN = 5,
            BOX_SIDE_MARGIN = 10,
            BOXW = 75,
            BOXH,
            SCORE_BOX_TOP;

        BOARD_TOP = _stage.canvas.height - viewConst.SCORE_BOARD_HEIGHT;
        BOXH = viewConst.SCORE_BOARD_HEIGHT - (2 * BOX_TOP_MARGIN);
        SCORE_BOX_TOP = BOARD_TOP + BOX_TOP_MARGIN + 1;

        _scoreTxtShapes = [];
        _playerFlagShapes = [];


        addScoreboardBackground(BOARD_TOP);

        //Player-1
        scoreBox = addPlayerScoreBox(BOXW, BOXH);
        scoreBox.x = BOX_SIDE_MARGIN;
        scoreBox.y = SCORE_BOX_TOP;
        _stage.addChild(scoreBox);


        //Player-2
        scoreBox = addPlayerScoreBox(BOXW, BOXH);
        scoreBox.x = _stage.canvas.width - BOX_SIDE_MARGIN - BOXW;
        scoreBox.y = SCORE_BOX_TOP;
        _stage.addChild(scoreBox);



        setCurrentPlayerShape();

    }

    function addScoreboardBackground(top) {

        var tempShape;


            //Create the background shape.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR1, SB_BACK_COLOR2], [0, 1], 0, top, 0, _stage.canvas.height)
            .drawRect(0, top, _stage.canvas.width, _stage.canvas.height)
            .endFill();

        _stage.addChild(tempShape);


        //Create the top border line.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .setStrokeStyle(1)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, top)
            .lineTo(_stage.canvas.width, top);

        _stage.addChild(tempShape);

    }

    // Creates a new player score container
    function addPlayerScoreBox(boxW, boxH) {

        var container = new createjs.Container(),
            tempShape;


        //Add the background rectangle.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginStroke(SCORE_NUM_BORDER_COLOR)
            .beginFill(SCORE_NUM_BACK_COLOR)
            .drawRoundRect(0, 0, boxW, boxH, 3);

        container.addChild(tempShape);



        //Add the text shape that contains the current score.
        tempShape = new createjs.Text("0", "25px Helvetica", SCORE_TXT_COLOR);
        tempShape.x = boxW / 2;
        tempShape.y = 1 + (boxH / 2);
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        container.addChild(tempShape);
        _scoreTxtShapes.push(tempShape);



        //Add the flag that indicates when it's the players turn.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginFill(FLAG_COLOR)
            .beginStroke(FLAG_BORDER_COLOR)
            .arc((boxW / 2), boxH + 12, boxW / 4, Math.PI + (Math.PI *.25), Math.PI * 1.75);

        tempShape.alpha = 0;

        _playerFlagShapes.push(tempShape);
        container.addChild(tempShape);



        return container;
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