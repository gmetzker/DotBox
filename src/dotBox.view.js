var dotBox = dotBox || {};

dotBox.view = function (events, $parent) {

    //Alias
    var util = dotBox.utility;

    //Constants
    var CANVAS_ID_PREFIX = 'dotBoxCanvas_',
        DOT_RADIUS = 5,
        DOT_MARGIN = 20,
        CANVAS_BACK_COLOR = '#272822',
        CANVAS_BORDER_COLOR = '#3b3d38',
        DOT_COLOR_DEF = '#53d2f1',
        DOT_COLOR_DEF_OUTER = 'rgba(83, 210, 241, .02)',
        DOT_COLOR_HOV = '#89E0F5',
        DOT_COLOR_SEL = '#fc1f70',
       DOT_COLOR_CONN = '#E20355',

        LINE_COLOR_DEF = 'white',
        LINE_COLOR_BOXED = '#a4e402',
        BOX_COLOR_CONN = 'rgba(164,228,2,.33)',
        BORDER_SIZE = 2;

    //Members
    var _stage = null,
        _canvasId,
        _events = events,
        _model,
        _dotShapes,
        _hLineShapes = {},
        _vLineShapes = {};

    addSubscribers();


    function addSubscribers() {

        _events.subscribe('startGame', onStartGame);

        _events.subscribe('view.dotRollOver', onDotRollOver);

        _events.subscribe('view.dotRollOut', onDotRollOut);

        _events.subscribe('view.dotSelectionChanged', onDotSelectionChanged);

        _events.subscribe('view.lineConnected', onLineConnected);

        _events.subscribe('view.boxesScored', onBoxesScored);

    };

    function onStartGame(model) {

        var canvasId;

        if(_stage !== null) {
            throw new Error("The view method startGame has already been called.")
        }

        if(util.isNullOrUndefined(model)) {
            throw new Error("model is null or undefined.")
        } else {
            _model = model;
        }

        createCanvas();

        createStage();

        drawInitialView()

        startEventLoop();

    }

    function createUniqueCanvasId() {

        var i = 0,
            unqCanvasId = null,
            tempId,
            $otherCanvai;

        while(unqCanvasId === null) {

            tempId = CANVAS_ID_PREFIX + i;

            $otherCanvai = $('#' + tempId);

            if($otherCanvai.length === 0) {
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
        canvasHeight = dotSum + marginSum;

        $parent.append('<canvas style="background-color: ' + CANVAS_BACK_COLOR +
            '; border: solid ' + BORDER_SIZE + 'px ' + CANVAS_BORDER_COLOR + ';"' +
            ' width=' + canvasWidth +
            ' height=' + canvasHeight +
            ' id="' + canvasId + '"></canvas>');

        _canvasId = canvasId;

    }


    function createStage() {

        _stage = new createjs.Stage(_canvasId);

    }

    function drawInitialView() {

        var i,
            j,
            dotShape,
            dotRowCount = _model.getDotRowCount(),
            dotColCount  = _model.getDotColCount(),
            dotShapeRow;

        _dotShapes = [];

        for(j = 0; j < dotRowCount; j++) {

            for(i = 0; i < dotColCount; i++) {

                if(i == 0) {
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

                dotShape.on('rollover', function() { _events.publish('dotRollOver', this.dot); });
                dotShape.on('rollout', function() { _events.publish('dotRollOut', this.dot); });
                dotShape.on('click', function() { _events.publish('dotClick', this.dot); });


                dotShapeRow.push(dotShape);
                _stage.addChild(dotShape);

            }
        }

        _stage.update();

    }

    function startEventLoop() {

        _stage.enableMouseOver(10);

        createjs.Ticker.addEventListener("tick", tick);
        createjs.Ticker.setFPS(60);

    }


    function drawDotShape(dot) {

        var dotShape,
            color;

        if(dot instanceof createjs.Shape) {
            dotShape = dot;
            dot = dotShape.dot;
        } else {
            dotShape = getDotShape(dot);
        }


        dotShape.graphics.clear();

        if(_model.isSelectedDot(dot)) {
            color = DOT_COLOR_SEL;
        } else if(_model.isHoveredDot(dot) && _model.canConnectDots(dot)) {
            color = DOT_COLOR_CONN;
        } else {
            if(_model.isHoveredDot(dot)) {
                color = DOT_COLOR_HOV;
            } else {
                color = DOT_COLOR_DEF;
            }
        }

        dotShape.graphics.beginFill(DOT_COLOR_DEF_OUTER).drawCircle(0, 0, DOT_RADIUS * 2.80);
        dotShape.graphics.beginFill(color).drawCircle(0, 0, DOT_RADIUS);

        if(_model.hasAnyOpenLines(dot)) {
            dotShape.cursor = "pointer";
        } else {
            dotShape.cursor = null;
        }


        return dotShape;

    }

    function getDotShape(dot) {
        //DotShapes is indexed as row, col
        return _dotShapes[dot.y][dot.x];
    };

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

        if( oldDot !== null) {
            drawDotShape(oldDot);
        }

        if( newDot !== null) {
            drawDotShape(newDot);
        }

        if( oldDot !== newDot) {
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

        if(util.isNullOrUndefined(lineShape)) {
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

        if(newShape) { _stage.addChild(lineShape); }


    }


    function onBoxesScored(scoredBoxes){

        var i;
        for(i = 0; i < scoredBoxes.length; i++ ) {
            drawScoredBox(scoredBoxes[i]);
        }

    }

    function drawScoredBox(box) {

        var i,
            lineShape,
            rectShape,
            ulDotShape,
            lrDotShape,
            boxW,
            boxH;

        for(i = 0; i < box.lines.length; i++) {
            drawLineShape(box.lines[i], LINE_COLOR_BOXED);
        }

        ulDotShape = getDotShape(box.lines[0].d1);
        lrDotShape = getDotShape(box.lines[1].d2);
        boxW = lrDotShape.x - ulDotShape.x;
        boxH = lrDotShape.y - ulDotShape.y;

        rectShape = new createjs.Shape();
        rectShape.graphics
            .beginFill(BOX_COLOR_CONN)
            .drawRect(ulDotShape.x, ulDotShape.y, boxW, boxH);

        _stage.addChild(rectShape);

    }



    function setLineShape(line, shape) {

        var lookup,
            row;

        lookup = getLineShapeLookup(line);

        row = lookup.store[lookup.y];
        if(util.isNullOrUndefined(row)) {
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


        if(!lookup.store.hasOwnProperty(lookup.y)) {
            return null;
        } else {
            row = lookup.store[lookup.y];
        }

        if(!row.hasOwnProperty(lookup.x)) {
            return null;
        } else {
            shape = row[lookup.x];
        }


        return shape;

    }

    function getLineShapeLookup(line) {

        var x,
            y,
            store;

        if(util.line.isHLine(line)) {
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


    function tick(event) {
        _stage.update();
    }

    return {

    };






};
