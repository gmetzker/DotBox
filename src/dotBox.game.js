var dotBox = dotBox || {};



/**
* Creates a new dotBox game and adds it to the container specified by
* config.parentId.
* @function    game
*/
dotBox.game = function game(parent) {

    var $parent,
        _events,
        _boardView,
        _scoreView,
        _controller;

    $parent = getJqueryParent(parent);
    _events = new Observer();
    _boardView = dotBox.views.board(_events, $parent);
    _scoreView = dotBox.views.score(_events);
    _controller = dotBox.controller(_events);

    _controller.startGame();

    function getJqueryParent(p) {

        if(p instanceof jQuery) {
            //Only use the first element
            return $(p[0]);
        } else if (p instanceof string) {

            //If it's a string, assume it's
            //an id add the hash tag if it doesn't have one.
            if( p.lastIndexOf("#", 0) !== 0 ) {
                p = '#' + p;
            }

        }

        return $(p);
    }

};




(function ( $ ) {

    $.fn.dotBox = function() {

        dotBox.game(this);

        return this;

    };

}( jQuery ));
