/*global createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.score = function (viewContext, model) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.views.constants,
        Color = dotBox.views.Color;

    //Members
    //noinspection JSLint
    var that = {},
        scoreTxtShapes = [],
        playerFlagShapes = [],
        playerBg = [],
        playerNameShapes = [];

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
        pixelConst = viewContext.scaleAllPixelProps({
            SCORE_BOX_W: 75,
            SCORE_BOARD_HEIGHT: 65,
            SCORE_FONT_SIZE: 25,
            P_NAME_FONT_SIZE: 10
        });

    if (util.isNullOrUndefined(viewContext)) {
        throw new Error("viewContext is null or undefined.");
    }

    if (util.isNullOrUndefined(model)) {
        throw new Error("model is null or undefined.");
    }

    reserveCanvasSize();
    addSubscribers();


    function reserveCanvasSize() {

        viewContext.observer.publish("view.reserveCanvasSize", { height: pixelConst.SCORE_BOARD_HEIGHT });

    }

    function addSubscribers() {

        viewContext.observer.subscribe('startGame', onStartGame);

        viewContext.observer.subscribe('view.boxesScored', onBoxesScored);

        viewContext.observer.subscribe('views.playerTurnChanged', onPlayerTurnChanged);

    }

    function onStartGame() {

        drawScoreBoard();

    }

    function onBoxesScored() {

        var i,
            playerScores;

        playerScores = model.getCurrentScores();

        for (i = 0; i < playerScores.length; i++) {
            scoreTxtShapes[i].text = playerScores[i];
        }

    }

    function onPlayerTurnChanged() {
        setCurrentPlayerShape();
    }



    function drawScoreBoard() {

        var scoreBox,
            BOARD_TOP,
            SCORE_BOX_TOP,
            SCORE_BOX_SIDE_MARGIN = viewContext.scalePixel(10),
            SCORE_BOX_TOP_MARGIN = viewContext.scalePixel(5),
            SCORE_BOX_H = pixelConst.SCORE_BOARD_HEIGHT - (2 * SCORE_BOX_TOP_MARGIN);

        BOARD_TOP = viewContext.height() - pixelConst.SCORE_BOARD_HEIGHT;
        SCORE_BOX_TOP = BOARD_TOP + SCORE_BOX_TOP_MARGIN + 1;

        scoreTxtShapes = [];
        playerFlagShapes = [];
        playerBg = [];
        playerNameShapes = [];

        addScoreboardBackground(BOARD_TOP);

        //Player-1
        scoreBox = addPlayerScoreBox(viewContext.playerNames[0], SCORE_BOX_H);
        scoreBox.x = SCORE_BOX_SIDE_MARGIN;
        scoreBox.y = SCORE_BOX_TOP;
        viewContext.stage.addChild(scoreBox);


        //Player-2
        scoreBox = addPlayerScoreBox(viewContext.playerNames[1], SCORE_BOX_H);
        scoreBox.x = viewContext.width() - SCORE_BOX_SIDE_MARGIN - pixelConst.SCORE_BOX_W;
        scoreBox.y = SCORE_BOX_TOP;
        viewContext.stage.addChild(scoreBox);



        setCurrentPlayerShape();

    }

    function addScoreboardBackground(top) {

        var tempShape,
            STROKE_SIZE = viewContext.scalePixel(1),
            height = viewContext.height(),
            width = viewContext.width();


            //Create the background shape.
        tempShape = new createjs.Shape();

        tempShape.graphics
            .beginLinearGradientFill([SB_BACK_COLOR1, SB_BACK_COLOR2], [0, 1], 0, top, 0, height)
            .drawRect(0, top, width, height)
            .endFill();




        //Create the top border line.



        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(SB_BORDER_COLOR2)
            .moveTo(0, top)
            .lineTo(width, top)
            .endStroke();


        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(SB_BORDER_COLOR)
            .moveTo(0, top + STROKE_SIZE)
            .lineTo(width, top + STROKE_SIZE)
            .endStroke();



        viewContext.stage.addChild(tempShape);

    }

    // Creates a new player score container
    function addPlayerScoreBox(name, height) {

        var container = new createjs.Container(),
            tempShape,
            STROKE_SIZE = viewContext.scalePixel(1),
            CORNER_RADIUS = viewContext.scalePixel(2),
            P_NAME_TOP = viewContext.scalePixel(9),
            P_SCORE_TOP_PAD = viewContext.scalePixel(6),
            P_FLAG_PAD = viewContext.scalePixel(13);


        //Add the background rectangle.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(SCORE_NUM_BORDER_COLOR)
            .beginFill(SCORE_NUM_BACK_COLOR)
            .drawRoundRect(0, 0, pixelConst.SCORE_BOX_W, height, CORNER_RADIUS);

        container.addChild(tempShape);



        //Add the text shape that contains the current score.
        tempShape = new createjs.Text("0", pixelConst.SCORE_FONT_SIZE + "px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = pixelConst.SCORE_BOX_W / 2;
        tempShape.y = P_SCORE_TOP_PAD + (height / 2);
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        container.addChild(tempShape);
        scoreTxtShapes.push(tempShape);



        //Add the flag that indicates when it's the players turn.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginFill(FLAG_COLOR)
            .beginStroke(FLAG_BORDER_COLOR)
            .arc((pixelConst.SCORE_BOX_W / 2), height + P_FLAG_PAD, pixelConst.SCORE_BOX_W / 4, Math.PI + (Math.PI * 0.25), Math.PI * 1.75);

        tempShape.alpha = 0;

        playerFlagShapes.push(tempShape);
        container.addChild(tempShape);



        tempShape = new createjs.Shape();
        drawPlayerBackground(tempShape, height);

        container.addChild(tempShape);
        playerBg.push(tempShape);

        //Add player name
        tempShape = new createjs.Text(name, pixelConst.P_NAME_FONT_SIZE + "px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = pixelConst.SCORE_BOX_W / 2;
        tempShape.y = P_NAME_TOP;
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        playerNameShapes.push(tempShape);
        container.addChild(tempShape);


        return container;
    }

    function setCurrentPlayerShape() {

        var i,
            tempShape,
            playerIdx = model.getCurrentPlayer(),
            nameTxtColor,
            targetFillColor,
            targetStrokeColor,
            lightShape;

        for (i = 0; i < playerFlagShapes.length; i++) {


            tempShape = playerFlagShapes[i];
            if (i === playerIdx) {

                if (tempShape.alpha === 0) {
                    createjs.Tween.get(tempShape, {override: false}).to({alpha: 1.0}, 250, createjs.Ease.sineIn);
                }
                nameTxtColor = viewConst.SCORE_TXT_COLOR;
            } else {
                createjs.Tween.get(tempShape, {override: false}).to({alpha: 0}, 250, createjs.Ease.sineOut);
                nameTxtColor = P_NON_TURN_TXT_COLOR;
            }


            lightShape = playerBg[i];
            targetFillColor = getPlayerColor('fill', i, playerIdx);
            targetStrokeColor = getPlayerColor('stroke', i, playerIdx);

            createjs.Tween
                .get(lightShape.fillColor, {override: true})
                .to(targetFillColor, 200);

            createjs.Tween
                .get(lightShape.strokeColor, {override: true})
                .to(targetStrokeColor, 200);



            playerNameShapes[i].color = nameTxtColor;
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


    function drawPlayerBackground(shape, scoreBoxHeight) {

        var height = Math.round(scoreBoxHeight * 0.3),
            STROKE_SIZE = viewContext.scalePixel(2),
            CORNER_RADIUS = viewContext.scalePixel(2);

        //Set custom color objects so we can Tween these.
        shape.fillColor = new Color(P_NON_TURN_COLOR);
        shape.strokeColor = new Color(P_NON_TURN_COLOR);

        shape.graphics
            .setStrokeStyle(STROKE_SIZE)
            .beginStroke(P_NON_TURN_COLOR)
            .beginFill(P_NON_TURN_COLOR)
            .inject(viewContext.setDrawColors, shape)
            .drawRoundRect(0, 0, pixelConst.SCORE_BOX_W, height, CORNER_RADIUS)
            .endFill();


    }




    return that;

};