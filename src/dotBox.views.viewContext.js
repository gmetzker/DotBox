/*global $, createjs */

var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};


/**
 * @class viewContext
 * @classdesc Creates a new viewContext object.
 * @param {Observer} observer       - The Observer instance used for broadcasting events and binding to the controller.
 * @param {number}   pixelRatio
 * @param {number}   playerCount    - The number of players in the game.
 */
dotBox.views.viewContext = function viewContext(observer, pixelRatio, playerCount) {

    var util = dotBox.utility,
        that,
        reservedCanvasSize;

    if (util.isNullOrUndefined(observer)) {
        throw new Error('observer parameter is required.');
    }

    if (util.isNullOrUndefined(pixelRatio)) {
        throw new Error('pixelRatio is required.');
    }

    reservedCanvasSize = {
        height: 0,
        width: 0
    };

    observer.subscribe("view.reserveCanvasSize", onReserveCanvasSize);


    that = {
        observer: observer,
        pixelRatio: pixelRatio,
        stage: null,
        initCanvasStage: initCanvasStage,
        scalePixel: scalePixel,
        scaleAllPixelProps: scaleAllPixelProps,
        setDrawColors: setDrawColors,
        width: width,
        height: height,
        playerNames: buildPlayerNames(playerCount)
    };


    function width() {

        if (that.stage === null) {
            throw new Error("stage has not been initialized; call initCanvasStage first.");
        }

        return that.stage.canvas.width;
    }

    function height() {

        if (that.stage === null) {
            throw new Error("stage has not been initialized; call initCanvasStage first.");
        }

        return that.stage.canvas.height;
    }

    /**
     * Scales an object by the pixel ratio.
     * @param {number} value    - A value to scale.
     * @returns {number}        - The scaled pixel value.
     */
    function scalePixel(value) {
        return value * pixelRatio;
    }

    /**
     * Takes an object where every property in the object is a pixel value, and
     * scales each pixel value according to the pixel ratio.
     * @param {*} pixelSet      - An object with every property a pixel value.
     * @returns {*}             - Returns the pixelSet.
     */
    function scaleAllPixelProps(pixelSet) {

        var propName;

        for (propName in pixelSet) {
            if (pixelSet.hasOwnProperty(propName)) {
                pixelSet[propName] = pixelSet[propName] * pixelRatio;
            }
        }

        return pixelSet;

    }

    /**
     * Used when drawing createjs shapes.  This can be used to inject instructions
     * dynamically during run time.  Specifically we use it to animate the fill
     * or stroke colors of a shape.
     * @param {createjs.Shape} shape
     */
    function setDrawColors(shape) {

        var fillColor = shape.fillColor,
            strokeColor = shape.strokeColor;

        if (!dotBox.utility.isNullOrUndefined(fillColor)) {
            //noinspection JSUnusedGlobalSymbols
            this.fillStyle = fillColor.toString();
        }
        if (!dotBox.utility.isNullOrUndefined(strokeColor)) {
            //noinspection JSUnusedGlobalSymbols
            this.strokeStyle = strokeColor.toString();
        }

    }

    /**
     * Handles the view.reserveCanvasSize event.  Any time size is reserved
     * reservedCanvasSize has it's height or width incremented.
     *
     * @param {*} size
     */
    function onReserveCanvasSize(size) {

        if (util.isNullOrUndefined(size)) { return; }

        if (!util.isNullOrUndefined(size.height)) {
            reservedCanvasSize.height += size.height;
        }
        if (!util.isNullOrUndefined(size.width)) {
            reservedCanvasSize.width += size.width;
        }

    }

    function createUniqueCanvasId() {

        var CANVAS_ID_PREFIX = 'dotBoxCanvas_',
            i = 0,
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

    function createCanvas($parent) {

        var canvasId,
            canvasHtml,
            widthStyle,
            heightStyle;

        canvasId = createUniqueCanvasId();
        widthStyle = reservedCanvasSize.width * (1 / pixelRatio);
        heightStyle = reservedCanvasSize.height * (1 / pixelRatio);

        canvasHtml = '<canvas id="' + canvasId + '" ' +
            'width=' + reservedCanvasSize.width + ' ' +
            'height=' + reservedCanvasSize.height + ' ' +
            'style="width: ' + widthStyle + 'px; ' +
            'height: ' + heightStyle + 'px;">' +
            '</canvas>';

        $parent.append(canvasHtml);

        return canvasId;

    }



    function createStage(canvasId) {

        that.stage = new createjs.Stage(canvasId);

    }


    function initCanvasStage($parent) {

        var canvasId;

        canvasId = createCanvas($parent);

        createStage(canvasId);

    }

    function buildPlayerNames(count) {
        var i,
            names = [];

        for (i = 0; i < count; i++) {
            names.push('PLAYER ' + (i + 1));
        }

        return names;

    }




    return that;

};