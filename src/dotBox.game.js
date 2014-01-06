/*global  $, jQuery, Observer*/

var dotBox = dotBox || {};



/**
* Creates a new dotBox game and adds it to the container specified by
* config.parentId.
* @function    game
*/
dotBox.game = function game(parent) {

    var $parent,
        _events,
        _views = [],
        _controller;

    $parent = getJqueryParent(parent);
    _events = new Observer();

    _views.push(dotBox.views.board(_events, $parent));
    _views.push(dotBox.views.score(_events));
    _views.push(dotBox.views.gameOver(_events));
    _controller = dotBox.controller(_events);

    _controller.startGame();


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
