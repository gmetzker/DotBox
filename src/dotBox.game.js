/*global  $, jQuery, Observer*/

var dotBox = dotBox || {};



/**
* Creates a new dotBox game and adds it to the container specified by
* config.parentId.
* @function    game
*/
dotBox.game = function game(parent) {

    var observer,
        viewContext,
        views = [],
        controller,
        model,
        pixelRatio;

    observer = new Observer();
    pixelRatio = window.devicePixelRatio;
    viewContext = dotBox.views.viewContext(observer, pixelRatio, 2);

    controller = dotBox.controller(observer);
    model = controller.model;

    //Create views first before initializing the canvas.
    //This way the views can reserve their canvas height/width.
    views.push(dotBox.views.board(viewContext, model));
    views.push(dotBox.views.score(viewContext, model));
    views.push(dotBox.views.gameOver(viewContext, model));


    viewContext.initCanvasStage(getJqueryParent(parent));

    controller.startGame();



    function getJqueryParent(p) {

        if (p instanceof jQuery) {
            //Only use the first element
            return $(p[0]);
        }

        if (typeof p === 'string') {

            //If it's a string, assume it's
            //an id add the hash tag if it doesn't have one.
            if (p.lastIndexOf("#", 0) !== 0) {
                p = '#' + p;
            }

        }

        return $(p);
    }

};




(function ($) {

    $.fn.dotBox = function () {

        dotBox.game(this);

        return this;

    };

}(jQuery));
