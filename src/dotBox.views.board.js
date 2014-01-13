/*global $, createjs */
var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};


dotBox.views.board = function (viewContext, model) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.views.constants,
        Color = dotBox.views.Color;


    if (util.isNullOrUndefined(viewContext)) {
        throw new Error("viewContext is null or undefined.");
    }

    if (util.isNullOrUndefined(model)) {
        throw new Error("model is null or undefined.");
    }


    //Constants
    //noinspection JSLint
    var pixelSizes = viewContext.pixelSizes,
        DOT_COLOR_DEF = '#53d2f1',
        DOT_COLOR_HOV = '#89E0F5',
        DOT_COLOR_SEL = '#fc1f70',
        DOT_COLOR_CONN = '#E20355',
        LINE_COLOR_DEF = 'white';

    //Members
    //noinspection JSLint
    var dotShapes,
        hLineShapes = {},
        vLineShapes = {},
        mouseOverIntervalId,
        lastDotUnderMouse = null;


    reserveCanvasSize();
    addSubscribers();



    function reserveCanvasSize() {

        var size,
            dotSum,
            marginSum;

        size = {
            height: 0,
            width: 0
        };


        dotSum = model.getDotColCount() * (2 * pixelSizes.DOT_RADIUS);
        marginSum = (model.getDotColCount() + 1) * pixelSizes.DOT_MARGIN;
        size.width = dotSum + marginSum;

        dotSum = model.getDotRowCount() * (2 * pixelSizes.DOT_RADIUS);
        marginSum = (model.getDotRowCount() + 1) * pixelSizes.DOT_MARGIN;
        size.height = dotSum + marginSum;


        viewContext.observer.publish("view.reserveCanvasSize", size);
    }

    function addSubscribers() {

        viewContext.observer.subscribe('startGame', onStartGame);

        viewContext.observer.subscribe('view.dotRollOver', onDotRollOver);

        viewContext.observer.subscribe('view.dotRollOut', onDotRollOut);

        viewContext.observer.subscribe('view.dotSelectionChanged', onDotSelectionChanged);

        viewContext.observer.subscribe('view.lineConnected', onLineConnected);

        viewContext.observer.subscribe('view.boxesScored', onBoxesScored);


    }


    function onStartGame() {

        drawInitialView();

        startEventLoop();

    }


    function drawBackground() {

        var bgShape;

        bgShape = new createjs.Shape();
        bgShape.graphics
            .beginFill(viewConst.BOARD_BACK_COLOR)
            .drawRect(0, 0, viewContext.width(), viewContext.height());

        viewContext.stage.addChild(bgShape);


    }


    function drawInitialView() {

        var i,
            j,
            dotShape,
            dotRowCount = model.getDotRowCount(),
            dotColCount  = model.getDotColCount(),
            dotShapeRow;

        drawBackground();


        dotShapes = [];

        for (j = 0; j < dotRowCount; j++) {

            for (i = 0; i < dotColCount; i++) {

                if (i === 0) {
                    dotShapeRow = [];
                    dotShapes.push(dotShapeRow);
                }


                dotShape = new createjs.Shape();
                dotShape.dot = {
                    x: i,
                    y: j
                };

                drawDotShape(dotShape);

                dotShape.x = (i * (pixelSizes.DOT_MARGIN + pixelSizes.DOT_RADIUS * 2)) + (pixelSizes.DOT_MARGIN + pixelSizes.DOT_RADIUS);
                dotShape.y = (j * (pixelSizes.DOT_MARGIN + pixelSizes.DOT_RADIUS * 2)) + (pixelSizes.DOT_MARGIN + pixelSizes.DOT_RADIUS);


                dotShape.on('click', fireDotClick);


                dotShapeRow.push(dotShape);
                viewContext.stage.addChild(dotShape);

            }
        }



        viewContext.stage.update();

    }



    function fireDotRollOver(dot) {
        if (!util.isNullOrUndefined(dot)) {
            viewContext.observer.publish('dotRollOver', dot);
        }
    }
    function fireDotRollOut(dot) {
        if (!util.isNullOrUndefined(dot)) {
            viewContext.observer.publish('dotRollOut', dot);
        }
    }
    function fireDotClick() {
        viewContext.observer.publish('dotClick', this.dot);
    }

    function startEventLoop() {

        enableMouseOver(20);

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);

    }

    function enableMouseOver(frequency) {

        if (mouseOverIntervalId) {

            clearInterval(mouseOverIntervalId);
            //noinspection JSUnusedAssignment
            mouseOverIntervalId = null;

        }

        if (frequency === null) {
            frequency = 20;
        } else if (frequency <= 0) {
            return;
        }
        mouseOverIntervalId = setInterval(mouseOverTick, 1000 / Math.min(50, frequency));

    }

    function mouseOverTick() {

        var prevDotUnderMouse = lastDotUnderMouse,
            dotUnderMouse = getDotFromUnderMouse(pixelSizes.DOT_RADIUS * 2.5);
           // dotIfInRollOverArea = getDotFromUnderMouse(pixelSizes.DOT_RADIUS * 2.5);



        if (!util.areSameDot(prevDotUnderMouse, dotUnderMouse)) {

            if (!util.isNullOrUndefined(dotUnderMouse) && model.hasAnyOpenLines(dotUnderMouse)) {
                setCursor("pointer");
            } else {
                setCursor("");
            }

            lastDotUnderMouse = dotUnderMouse;

            fireDotRollOut(prevDotUnderMouse);

            fireDotRollOver(dotUnderMouse);

        }


    }

    function setCursor(cursor) {
        viewContext.stage.canvas.style.cursor = cursor;
    }

    function tick() {
        viewContext.stage.update();
    }

    function getDotColor(dot) {

        var coreColor,
            color;

        if (model.isSelectedDot(dot)) {

            coreColor = DOT_COLOR_SEL;

        } else if (model.isHoveredDot(dot) && model.canConnectDots(dot)) {

            coreColor = DOT_COLOR_CONN;

        } else {

            if (model.isHoveredDot(dot)) {
                coreColor = DOT_COLOR_HOV;
            } else {
                coreColor = DOT_COLOR_DEF;
            }

        }

        color = new Color(coreColor);
        return color;
    }

    function drawDotShape(dot) {

        var dotShape,
            color,
            drawToShape;



        if (dot instanceof createjs.Shape) {
            dotShape = dot;
            dot = dotShape.dot;
            drawToShape = true;
        } else {
            dotShape = getDotShape(dot);
            drawToShape = false;
        }

        color = getDotColor(dot);

        if (drawToShape) {

            dotShape.fillColor = color;
            dotShape.graphics
                .beginFill(color)
                .inject(viewContext.setDrawColors, dotShape)
                .drawCircle(0, 0, pixelSizes.DOT_RADIUS)
                .endFill();

        } else {
            createjs.Tween
                .get(dotShape.fillColor, {override: true})
                .to(color, 250);
        }


        return dotShape;

    }



    function getDotShape(dot) {
        //DotShapes is indexed as row, col
        return dotShapes[dot.y][dot.x];
    }

    function onDotRollOver(dot) {


        var dotShape = drawDotShape(dot);
        createjs.Tween.get(dotShape, {override: true}).to({scaleX: 2, scaleY: 2}, 150);

    }

    function onDotRollOut(dot) {


        var dotShape = drawDotShape(dot);
        createjs.Tween.get(dotShape, {override: true}).to({scaleX: 1, scaleY: 1}, 150);

    }

    function onDotSelectionChanged(oldDot, newDot) {

        var dotShape;

        if (oldDot !== null) {
            drawDotShape(oldDot);
        }

        if (newDot !== null) {
            drawDotShape(newDot);
        }

        if (oldDot !== newDot) {
            //If dot was unselected, make it not hovered.
            dotShape = getDotShape(newDot !== null ? newDot : oldDot);
            createjs.Tween
                .get(dotShape, {override: true})
                .to({scaleX: 1, scaleY: 1}, 150)
                .call(function () {
                    var dotUnder = getDotFromUnderMouse(pixelSizes.DOT_RADIUS);
                    if (util.isNullOrUndefined(dotUnder)) {
                        setCursor("");
                    }
                });

        }

    }

    function onLineConnected(line) {

        var dotShape;

        drawDotShape(line.d1);
        dotShape = drawDotShape(line.d2);
        createjs.Tween.get(dotShape, {override: true}).to({scaleX: 1, scaleY: 1}, 150);

        drawLineShape(line, LINE_COLOR_DEF);
    }





    function drawLineShape(line, color) {

        var lineShape,
            d1Shape = getDotShape(line.d1),
            d2Shape = getDotShape(line.d2),
            newShape = false,
            LINE_SIZE = viewContext.scalePixel(1);

        lineShape = getLineShape(line);

        if (util.isNullOrUndefined(lineShape)) {
            lineShape = new createjs.Shape();
            setLineShape(line, lineShape);
            newShape = true;
        } else {
            lineShape.graphics.clear();
        }

        lineShape.graphics
            .setStrokeStyle(LINE_SIZE)
            .beginStroke(color)
            .moveTo(d1Shape.x, d1Shape.y)
            .lineTo(d2Shape.x, d2Shape.y);



        if (newShape) {

            lineShape.on('click', onShapeClick);
            viewContext.stage.addChild(lineShape);
        }


    }

    function onShapeClick(e) {

        var objectsUnder,
            dotShapes,
            isDotShape;

        objectsUnder = viewContext.stage.getObjectsUnderPoint(e.stageX, e.stageY);

        isDotShape = function isDotShape(shape) {

            return !util.isNullOrUndefined(shape.dot);

        };

        dotShapes = objectsUnder.filter(isDotShape);

        if (dotShapes.length > 0) {
            fireDotClick.apply(dotShapes[0]);
        }


    }


    function onBoxesScored(scoredBoxes, playerIndex) {

        var i;

        for (i = 0; i < scoredBoxes.length; i++) {
            drawBox(scoredBoxes[i], playerIndex);

        }

        pointAnimation(scoredBoxes[0], scoredBoxes.length);


    }

    function drawBox(box, playerIndex) {

        var rectShape,
            ulDotShape,
            lrDotShape,
            boxW,
            boxH,
            boxColor,
            borderColor,
            scale,
            BOX_SCORED_SIZE_INC = viewContext.scalePixel(10),
            BORDER_SIZE = viewContext.scalePixel(1);

        borderColor = viewContext.getPlayerColor(playerIndex);
        boxColor = new Color(borderColor);

        boxColor.alpha = 0.33;
        boxColor = boxColor.toString();

        ulDotShape = getDotShape(box.lines[0].d1);
        lrDotShape = getDotShape(box.lines[1].d2);
        boxW = lrDotShape.x - ulDotShape.x;
        boxH = lrDotShape.y - ulDotShape.y;

        rectShape = new createjs.Shape();
        rectShape.graphics
            .setStrokeStyle(BORDER_SIZE)
            .beginStroke(borderColor)
            .beginFill(boxColor)
            .drawRect(ulDotShape.x, ulDotShape.y, boxW, boxH);

        scale = ((boxW + BOX_SCORED_SIZE_INC) / boxW);
        rectShape.scaleX = scale;
        rectShape.scaleY = scale;


        rectShape.x = (-1 * ((ulDotShape.x * scale) - ulDotShape.x)) - (BOX_SCORED_SIZE_INC / 2);
        rectShape.y = (-1 * ((ulDotShape.y * scale) - ulDotShape.y)) - (BOX_SCORED_SIZE_INC / 2);

        rectShape.upperLeft = {x: ulDotShape.x, y: ulDotShape.y};

        rectShape.on('click', onShapeClick);
        viewContext.stage.addChild(rectShape);


        viewContext.boxShapes[box.box] = rectShape;

        createjs.Tween.get(rectShape, {override: true})
            .to({
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1
            }, 250);


    }

    function pointAnimation(box, pointCount) {

        var x,
            y,
            tempShape,
            ds1,
            ds2;

        ds1 = getDotShape(box.lines[0].d1);
        ds2 = getDotShape(box.lines[0].d2);
        x = ds1.x + ((ds2.x - ds1.x) / 2);

        ds1 = getDotShape(box.lines[1].d1);
        ds2 = getDotShape(box.lines[1].d2);
        y = ds1.y + ((ds2.y - ds1.y) / 2);

        tempShape = new createjs.Text("+" + pointCount, pixelSizes.POINT_FONT_SIZE + "px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = x;
        tempShape.y = y;
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        viewContext.stage.addChild(tempShape);

        createjs.Tween
            .get(tempShape, {override: false})
            .to({alpha: 0, y: y + viewContext.scalePixel(200)}, 2500, createjs.Ease.sineOut)
            .call(function () { viewContext.stage.removeChild(tempShape); });


        createjs.Tween
            .get(tempShape, {override: false})
            .to({scaleX: 1.5, scaleY: 1.5 }, 200, createjs.Ease.elasticInOut);


    }



    function setLineShape(line, shape) {

        var lookup,
            row;

        lookup = getLineShapeLookup(line);

        row = lookup.store[lookup.y];
        if (util.isNullOrUndefined(row)) {
            row = {};
            lookup.store[lookup.y] = row;
        }

        row[lookup.x] = shape;

    }

    function getLineShape(line) {

        var lookup,
            row,
            shape;

        lookup = getLineShapeLookup(line);


        if (!lookup.store.hasOwnProperty(lookup.y)) {
            return null;
        }
        row = lookup.store[lookup.y];

        if (!row.hasOwnProperty(lookup.x)) {
            return null;
        }
        shape = row[lookup.x];

        return shape;

    }

    function getLineShapeLookup(line) {

        var x,
            y,
            store;

        if (util.line.isHLine(line)) {
            //Horizontal Line.
            store = hLineShapes;
            y = line.d1.y;
            x = Math.min(line.d1.x, line.d2.x);

        } else {
            //Vertical Line.
            store = vLineShapes;
            y = Math.min(line.d1.y, line.d2.y);
            x = line.d1.x;

        }

        return {
            x: x,
            y: y,
            store: store
        };


    }



    function getDotIndex(value, dotCount) {

        var index,
            boundarySize;

        boundarySize = (2 * pixelSizes.DOT_RADIUS) + pixelSizes.DOT_MARGIN;
        index = Math.floor((value - (pixelSizes.DOT_MARGIN / 2)) / boundarySize);

        if ((index < 0) || (index >= dotCount)) {
            return null;
        }

        return index;

    }
    function isInCircle(point, origin, radius) {

        var sqrDist,
            sqrRad;

        sqrDist = Math.pow((origin.x - point.x), 2) + Math.pow((origin.y - point.y), 2);

        sqrRad = Math.pow(radius, 2);

        return sqrDist <= sqrRad;

    }


    function getDotFromUnderMouse(hitRadius) {

        var xIndex,
            yIndex,
            dot,
            shape,
            mousePoint;

        mousePoint = {
            x: viewContext.stage.mouseX,
            y: viewContext.stage.mouseY
        };

        if (!viewContext.stage.mouseInBounds) { return null; }

        xIndex = getDotIndex(mousePoint.x, model.getDotColCount());
        if (xIndex === null) { return null; }

        yIndex = getDotIndex(mousePoint.y, model.getDotRowCount());
        if (yIndex === null) { return null; }

        dot = {
            x: xIndex,
            y: yIndex
        };

        shape = getDotShape(dot);
        if (!isInCircle(mousePoint, {x: shape.x, y: shape.y}, hitRadius)) {
            dot = null;
        }

        return dot;

    }




    return {

    };



};
