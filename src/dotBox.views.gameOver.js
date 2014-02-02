/*global createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.gameOver = function (viewContext, model) {

    //Alias
    var util = dotBox.utility,
        Color = dotBox.views.Color,
        viewConstants = dotBox.views.constants;

    //Members
    //noinspection JSLint
    var that = {},
        gameStoped = false;


    //Constants
    //noinspection JSLint
    var FONT_SIZE = viewContext.scalePixel(18),
        pixelSizes = viewContext.pixelSizes;


    if (util.isNullOrUndefined(viewContext)) {
        throw new Error('viewContext is null or undefined.');
    }

    if (util.isNullOrUndefined(model)) {
        throw new Error("model is null or undefined.");
    }


    viewContext.observer.subscribe('gameOver', onGameOver);
    viewContext.observer.subscribe('stopGame', onStopGame);



    function onGameOver(winner) {

        var winnerName,
            looserName,
            winnerColor,
            looserColor,
            looserIndex,
            bgContainer;

        if (winner === 0) {
            looserIndex = 1;
        } else {
            looserIndex = 0;
        }

        winnerName = model.gameConfig.playerNames[winner];
        looserName = model.gameConfig.playerNames[looserIndex];
        winnerColor = viewContext.getPlayerColor(winner);
        looserColor = viewContext.getPlayerColor(looserIndex);


        bgContainer = drawBackground();
        glowBox(winner, bgContainer);
        drawText("=) " + winnerName + " wins!", winnerColor, 30);
        drawText("='(  " + 'Sorry ' + looserName, looserColor, 4030);


    }

    function onStopGame() {
        gameStoped = true;
    }

    function drawBackground() {

        var tempShape,
            container;

        container = new createjs.Container();
        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginFill(viewConstants.BOARD_BACK_COLOR)
            .drawRect(0, 0, viewContext.width(), viewContext.height() - viewContext.scalePixel(65));

        tempShape.alpha = 0.15;

        container.addChild(tempShape);
        viewContext.stage.addChild(container);

        createjs.Tween
            .get(tempShape, {override: true})
            .to({alpha: 0.5}, 600, createjs.Ease.sineIn)
            .call();

        return container;

    }

    function drawText(textValue, color, delayTime) {

        var container,
            txtObj,
            boardHeight,
            boardWidth,
            txtBounds,
            tempShape,
            MARGIN = viewContext.scalePixel(10),
            BORDER_SIZE = viewContext.scalePixel(2),
            bgColor,
            cHeight,
            cWidth,
            finalX,
            finalY;


        container = new createjs.Container();

        boardHeight = viewContext.height() - pixelSizes.SCORE_BOARD_HEIGHT;
        boardWidth = viewContext.width();


        //Create the text message.
        txtObj = new createjs.Text(textValue, FONT_SIZE + "px Helvetica", viewConstants.SCORE_TXT_COLOR);
        txtObj.textAlign = "center";
        txtObj.textBaseline = "middle";
        txtBounds = txtObj.getBounds();

        cHeight = txtBounds.height + (2 * MARGIN) + (2 * BORDER_SIZE);
        cWidth = txtBounds.width + (2 * MARGIN) + (2 * BORDER_SIZE);

        //Create the background.
        tempShape = new createjs.Shape();
        tempShape.graphics
            .beginFill(viewConstants.BOARD_BACK_COLOR)
            .drawRect(0, 0, cWidth, cHeight);

        container.addChild(tempShape);



        bgColor = new Color(color);
        bgColor.alpha = 0.20;
        tempShape = new createjs.Shape();
        tempShape.graphics
            .setStrokeStyle(BORDER_SIZE)
            .beginStroke(color)
            .beginFill(bgColor.toString())
            .drawRect(0, 0, cWidth, cHeight);

        container.addChild(tempShape);



        txtObj.x = cWidth / 2;
        txtObj.y = cHeight / 2;
        container.addChild(txtObj);


        //Calculate & set the x/y of the container so that it is in the middle of the game board.
        container.x = boardWidth / 2;
        container.y = boardHeight / 2;
        finalX = (boardWidth - cWidth) / 2;
        finalY = (boardHeight - cHeight) / 2;

        //Set the initial alpha/scale of the container so it is out of view.
        container.alpha = 0;
        container.scaleX = 0.0;
        container.scaleY = 0.0;

        viewContext.stage.addChild(container);


        //Animate the container.
        createjs.Tween
            .get(container, {override: true})
            .wait(delayTime)
            .to({
                alpha: 1,
                scaleX: 1.0,
                scaleY: 1.0,
                x: finalX,
                y: finalY
            }, 1000, createjs.Ease.quadIn)
            .wait(2500)
            .to({x: boardWidth + (cWidth / 2)}, 500, createjs.Ease.quadOut)
            .call(function () { viewContext.stage.removeChild(container); });

    }


    function createBoxShape(boxIndex, playerIndex, boxSize) {

        var rectShape,
            boxColor,
            borderColor,
            boxShape,
            BORDER_SIZE = viewContext.scalePixel(1);


        boxShape = viewContext.boxShapes[boxIndex];

        borderColor = viewContext.getPlayerColor(playerIndex);
        boxColor = new Color(borderColor);

        boxColor.alpha = 0.33;
        boxColor = boxColor.toString();

        rectShape = new createjs.Shape();
        rectShape.graphics
            .setStrokeStyle(BORDER_SIZE)
            .beginStroke(borderColor)
            .beginFill(boxColor)
            .drawRect(boxShape.upperLeft.x, boxShape.upperLeft.y, boxSize, boxSize);

        rectShape.upperLeft = {x: boxShape.upperLeft.x, y: boxShape.upperLeft.y};
        return rectShape;

    }

    function glowBox(winner, parent) {

        var playerBoxes,
            target1 = {},
            target2 = {},
            boxShape,
            boxIndex,
            boxSize;

        if (gameStoped) { return; }


        playerBoxes = model.getPlayerBoxes(winner);

        //This shouldn't be needed other than for testing.
        if (playerBoxes.length === 0) { return; }


        boxSize = (2 * pixelSizes.DOT_RADIUS) + pixelSizes.DOT_MARGIN;

        boxIndex = playerBoxes[util.getRandom(0, playerBoxes.length - 1)];
        boxShape = createBoxShape(boxIndex, winner, boxSize);

        target1.sizeDiff = viewContext.scalePixel(15);
        target1.scale = (boxSize + target1.sizeDiff) / boxSize;
        target1.x = (-1 * ((boxShape.upperLeft.x * target1.scale) - boxShape.upperLeft.x)) - (target1.sizeDiff / 2);
        target1.y =  (-1 * ((boxShape.upperLeft.y * target1.scale) - boxShape.upperLeft.y)) - (target1.sizeDiff / 2);



        target2.sizeDiff = viewContext.scalePixel(45);
        target2.scale = (boxSize + target2.sizeDiff) / boxSize;
        target2.x = (-1 * ((boxShape.upperLeft.x * target2.scale) - boxShape.upperLeft.x)) - (target2.sizeDiff / 2);
        target2.y =  (-1 * ((boxShape.upperLeft.y * target2.scale) - boxShape.upperLeft.y)) - (target2.sizeDiff / 2);


        boxShape.alpha = 0;

        parent.addChild(boxShape);

        //Tween BoxShape with a cool animation.
        createjs.Tween.get(boxShape, {override: false})
            .wait(1000)
            .to({
                alpha: 0.5
            }, 0)
            .to({
                alpha: 1,
                scaleX: target1.scale,
                scaleY: target1.scale,
                x: target1.x,
                y: target1.y
            }, 500)
            .to({
                alpha: 0,
                scaleX: target2.scale,
                scaleY: target2.scale,
                x: target2.x,
                y: target2.y
            }, 1500, createjs.Ease.sineOut)
            .call(function () {

                parent.removeChild(boxShape);
                glowBox(winner, parent);

            });


    }


    return that;

};