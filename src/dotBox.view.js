var dotBox = dotBox || {};

dotBox.view = function (events, $parent) {

    //Alias
    var util = dotBox.utility;

    //Constants
    var CANVAS_ID_PREFIX = 'dotBoxCanvas_',
        DOT_RADIUS = 5,
        DOT_MARGIN = 20,
        CANVAS_BACK_COLOR = 'blue',
        DOT_COLOR_DEF = 'red',
        DOT_COLOR_SEL = 'pink',
        DOT_COLOR_CONN = 'green',
        BORDER_SIZE = 2;

    //Members
    var _stage = null,
        _canvasId,
        _events = events,
        _model,
        _dotShapes;

    addSubscribers();


    function addSubscribers() {

        _events.subscribe('startGame', onStartGame);

        _events.subscribe('view.dotRollOver', onDotRollOver);

        _events.subscribe('view.dotRollOut', onDotRollOut);

        _events.subscribe('view.dotSelectionChanged', onDotSelectionChanged);

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
            '; border: solid ' + BORDER_SIZE + 'px black;"' +
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
                dotShape.cursor = "pointer";

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
            color = DOT_COLOR_DEF;
        }

        dotShape.graphics.beginFill('rgba(255, 0, 0, .02)').drawCircle(0, 0, DOT_RADIUS * 2.5);
        dotShape.graphics.beginFill(color).drawCircle(0, 0, DOT_RADIUS);

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

        if( !util.isNullOrUndefined(oldDot)) {
            drawDotShape(oldDot);
        }

        if( !util.isNullOrUndefined(newDot)) {
            drawDotShape(newDot);
        }
    }

    function tick(event) {
        _stage.update();
    }

    return {

    };






};
