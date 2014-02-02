/*global  $, jQuery, Observer*/

var dotBox = dotBox || {};

/**
 * @typedef     {Object}        gameConfig
 * @property    {number}        dotColCount         - The number of dot columns.
 * @property    {number}        dotRowCount         - The number of dot rows.
 * @property    {boolean}       useAi               - True will use the Ai for player 2.
 * @property    {number}        preMovePercent      - A percent value between 0 and 1.  If the value is non-zero
 *                                                    then the game will be pre-initialized a number of moves
 *                                                    equal to the given percent.
 * @property    {number}        uiScale             - The scale of the UI.
 * @property    {string[]}      playerNames         - The names of the players.
 */


/**
 * Starts a new game and adds the game canvas to the given parent container.
 * @function    game
 * @param  {jQuery|string}  parent  - A jQuery object that contains the parent
 *                                    to add the game canvas to, or the id of
 *                                    the parent container to add the canvas to.
 *
 * @param  {gameConfig}     config  - The game config with size and ai parameters.
*/
dotBox.game = function game(parent, config) {

    var observer,
        viewContext,
        views = [],
        controller,
        model,
        pixelRatio,
        that;

    observer = new Observer();
    pixelRatio = window.devicePixelRatio || Math.round(window.screen.availWidth / document.documentElement.clientWidth);
    viewContext = dotBox.views.viewContext(observer, pixelRatio, config.uiScale);

    controller = dotBox.controller(observer, config);
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

    function stopGame() {
        observer.publish('stopGame');
    }

    that = {
        stopGame: stopGame
    };

    return that;
};




(function ($) {

    $.fn.dotBox = function (config) {

        return dotBox.game(this, config);

    };

}(jQuery));
