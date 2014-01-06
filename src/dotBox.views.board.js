/*global $, createjs */
var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};


dotBox.views.board = function (events, $parent) {

    //Alias
    var util = dotBox.utility,
        viewConst = dotBox.views.constants,
        Color = dotBox.views.Color;

    //Constants
    //noinspection JSLint
    var CANVAS_ID_PREFIX = 'dotBoxCanvas_',
        DOT_RADIUS = 5,
        DOT_MARGIN = 20,
        CANVAS_BACK_COLOR = '#272822',
        DOT_COLOR_DEF = '#53d2f1',
        DOT_COLOR_DEF_OUTER = 'rgba(83, 210, 241, .02)',
        DOT_COLOR_HOV = '#89E0F5',
        DOT_COLOR_SEL = '#fc1f70',
        DOT_COLOR_CONN = '#E20355',
        LINE_COLOR_DEF = 'white';

    //Members
    //noinspection JSLint
    var _stage = null,
        _canvasId,
        _model,
        _dotShapes,
        _hLineShapes = {},
        _vLineShapes = {};

    addSubscribers();


    function addSubscribers() {

        events.subscribe('startGame', onStartGame);

        events.subscribe('view.dotRollOver', onDotRollOver);

        events.subscribe('view.dotRollOut', onDotRollOut);

        events.subscribe('view.dotSelectionChanged', onDotSelectionChanged);

        events.subscribe('view.lineConnected', onLineConnected);

        events.subscribe('view.boxesScored', onBoxesScored);

    }




    function onStartGame(model) {


        if (_stage !== null) {
            throw new Error("The view method startGame has already been called.");
        }

        if (util.isNullOrUndefined(model)) {
            throw new Error("model is null or undefined.");
        } else {
            _model = model;
        }

        createCanvas();

        createStage();

        drawInitialView();

        events.publish('views.boardDrawn', _stage, _model);

        startEventLoop();

    }



    function createUniqueCanvasId() {

        var i = 0,
            unqCanvasId = null,
            tempId,
            $otherCanvases;

        while (unqCanvasId === null) {

            tempId = CANVAS_ID_PREFIX + i;

            $otherCanvases = $('#' + tempId);

            if ($otherCanvases.length === 0) {
                unqCanvasId = tempId;
            }

            i += 1;

        }

        return unqCanvasId;

    }

    function createCanvas() {

        var canvasId,
            dotSum,
            marginSum,
            canvasWidth,
            canvasHeight;

        canvasId = createUniqueCanvasId();

        dotSum = _model.getDotColCount() * (2 * DOT_RADIUS);
        marginSum = (_model.getDotColCount() + 1) * DOT_MARGIN;
        canvasWidth = dotSum + marginSum;

        dotSum = _model.getDotRowCount() * (2 * DOT_RADIUS);
        marginSum = (_model.getDotRowCount() + 1) * DOT_MARGIN;
        canvasHeight = dotSum + marginSum + viewConst.SCORE_BOARD_HEIGHT;

        $parent.append('<canvas style="background-color: ' + CANVAS_BACK_COLOR + ';" ' +
            ' width=' + canvasWidth +
            ' height=' + canvasHeight +
            ' id="' + canvasId + '"></canvas>');

//    ' border: solid ' + BORDER_SIZE + 'px ' + CANVAS_BORDER_COLOR + ';"' +
        _canvasId = canvasId;

    }



    function createStage() {

        _stage = new createjs.Stage(_canvasId);

        events.publish("view.stageInit", _stage, _model);

    }

    function drawInitialView() {

        var i,
            j,
            dotShape,
            dotRowCount = _model.getDotRowCount(),
            dotColCount  = _model.getDotColCount(),
            dotShapeRow;

        _dotShapes = [];

        for (j = 0; j < dotRowCount; j++) {

            for (i = 0; i < dotColCount; i++) {

                if (i === 0) {
                    dotShapeRow = [];
                    _dotShapes.push(dotShapeRow);
                }


                dotShape = new createjs.Shape();
                dotShape.dot = {
                    x: i,
                    y: j
                };

                drawDotShape(dotShape);

                dotShape.x = (i * (DOT_MARGIN + DOT_RADIUS * 2)) + (DOT_MARGIN + DOT_RADIUS);
                dotShape.y = (j * (DOT_MARGIN + DOT_RADIUS * 2)) + (DOT_MARGIN + DOT_RADIUS);

                dotShape.on('rollover', fireDotRollOver);
                dotShape.on('rollout', fireDotRollOut);
                dotShape.on('click', fireDotClick);


                dotShapeRow.push(dotShape);
                _stage.addChild(dotShape);

            }
        }



        _stage.update();

    }

    function fireDotRollOver() {
        events.publish('dotRollOver', this.dot);
    }
    function fireDotRollOut() {
        events.publish('dotRollOut', this.dot);
    }
    function fireDotClick() {
        events.publish('dotClick', this.dot);
    }

    function startEventLoop() {

        _stage.enableMouseOver(10);

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);

    }


    function tick() {
        _stage.update();
    }

    function getDotColor(dot) {

        var coreColor,
            color;

        if (_model.isSelectedDot(dot)) {

            coreColor = DOT_COLOR_SEL;

        } else if (_model.isHoveredDot(dot) && _model.canConnectDots(dot)) {

            coreColor = DOT_COLOR_CONN;

        } else {

            if (_model.isHoveredDot(dot)) {
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

            dotShape.graphics
                .beginFill(DOT_COLOR_DEF_OUTER)
                .drawCircle(0, 0, DOT_RADIUS * 2.80);

            dotShape.fillColor = color;
            dotShape.graphics
                .beginFill(color)
                .inject(dotBox.views.setDrawColors, dotShape)
                .drawCircle(0, 0, DOT_RADIUS)
                .endFill();

        } else {
            createjs.Tween.get(dotShape.fillColor, {override: true}).to(color, 250);
        }




        if (_model.hasAnyOpenLines(dot)) {
            dotShape.cursor = "pointer";
        } else {
            dotShape.cursor = null;
        }


        return dotShape;

    }



    function getDotShape(dot) {
        //DotShapes is indexed as row, col
        return _dotShapes[dot.y][dot.x];
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
            createjs.Tween.get(dotShape, {override: true}).to({scaleX: 1, scaleY: 1}, 150);
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
            newShape = false;

        lineShape = getLineShape(line);

        if (util.isNullOrUndefined(lineShape)) {
            lineShape = new createjs.Shape();
            setLineShape(line, lineShape);
            newShape = true;
        } else {
            lineShape.graphics.clear();
        }

        lineShape.graphics
            .setStrokeStyle(1)
            .beginStroke(color)
            .moveTo(d1Shape.x, d1Shape.y)
            .lineTo(d2Shape.x, d2Shape.y);

        if (newShape) { _stage.addChild(lineShape); }


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
            extraSize;

        if (playerIndex === 0) {
            boxColor = new Color(viewConst.P1_COLOR);
            borderColor = viewConst.P1_COLOR;
        } else {
            boxColor = new Color(viewConst.P2_COLOR);
            borderColor = viewConst.P2_COLOR;
        }
        boxColor.alpha = 0.33;
        boxColor = boxColor.toString();

        ulDotShape = getDotShape(box.lines[0].d1);
        lrDotShape = getDotShape(box.lines[1].d2);
        boxW = lrDotShape.x - ulDotShape.x;
        boxH = lrDotShape.y - ulDotShape.y;

        rectShape = new createjs.Shape();
        rectShape.graphics
            .beginStroke(borderColor)
            .beginFill(boxColor)
            .drawRect(ulDotShape.x, ulDotShape.y, boxW, boxH);

        extraSize = 10;
        scale = ((boxW + extraSize) / boxW);
        rectShape.scaleX = scale;
        rectShape.scaleY = scale;


        rectShape.x = (-1 * ((ulDotShape.x * scale) - ulDotShape.x)) - (extraSize / 2);
        rectShape.y = (-1 * ((ulDotShape.y * scale) - ulDotShape.y)) - (extraSize / 2);


        _stage.addChild(rectShape);

        createjs.Tween.get(rectShape, {override: true}).to({
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

        tempShape = new createjs.Text("+" + pointCount, "15px Helvetica", viewConst.SCORE_TXT_COLOR);
        tempShape.x = x;
        tempShape.y = y;
        tempShape.textAlign = "center";
        tempShape.textBaseline = "middle";

        _stage.addChild(tempShape);

        createjs.Tween.get(tempShape, {override: false})
            .to({alpha: 0, y: y + 200}, 2500, createjs.Ease.sineOut)
            .call(function () { _stage.removeChild(tempShape); });


        createjs.Tween.get(tempShape, {override: false})
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
            store = _hLineShapes;
            y = line.d1.y;
            x = Math.min(line.d1.x, line.d2.x);

        } else {
            //Vertical Line.
            store = _vLineShapes;
            y = Math.min(line.d1.y, line.d2.y);
            x = line.d1.x;

        }

        return {
            x: x,
            y: y,
            store: store
        };


    }


    return {

    };






};
