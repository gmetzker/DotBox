var dotBox;
dotBox = dotBox || {};

/**
 * Game configuration options.
 * @typedef     {Object}    gameConfig
 * @property    {number}    dotCountLength     - The number of game dots across the length (x-axis) of the board.
 * @property    {number}    dotCountWidth      - The number of game dots across the width (y-axis) of the board.
 * @property    {number}    playerCount        - The number of players.
 * @property    {number}    startPlayer        - The index of the player who is starting.  Value must be between
 *                                               0 and playerCount - 1.
 */


/**
 * Specifies the position of a dot.
 * @typedef     {Object}    gameDot
 * @property    {number}    x       - The x-index (or length) coordinate of the dot.
 *                                    0 is is the x-index of the left most dot, and
 *                                    dotCountLength-1 is the right most dot x-index.
 * @property    {number}    y       - The y-index (or length) coordinate of the dot.
 *                                    0 is is the y-index of the top most dot, and
 *                                    dotCountWidth-1 is the bottom most dot y-index.
 */

/**
 * Move object that designates a line.
 * @typedef     {Object}    line
 * @property    {gameDot}   d1          - The position of the start dot in the line.
 * @property    {gameDot}   d2          - The position of the end dot in the line.
 */

/**
 * Creates a new game engine.
 * @function gameEngine
 * @param   {gameConfig}    - The game configuration options.
 *
 */
dotBox.gameEngine = function gameEngine(config) {

    var DEFAULT_PLAYER_COUNT = 2,
        DEFAULT_DOT_COUNT_LENGTH = 10,
        DEFAULT_DOT_COUNT_WIDTH = 10,
        DEFAULT_START_PLAYER = 0,
        util = dotBox.utility,
        _playerCount,
        _dotCountLength,
        _dotCountWidth,
        _boxCountLength,
        _boxCountWidth,
        _currentPlayer,
        _lineSet;



    configureGame(config);

    /**
     * Returns the number of players for the game.
     * @function getPlayerCount
     * @returns {number}
     */
    function getPlayerCount() {
        return _playerCount;
    }

    /**
     * Returns the current player index.
     * @returns {number}    - 0 for the first player, 1 for the second, etc...
     */
    function getCurrentPlayer() {
        return _currentPlayer;
    }

    /**
     * The number of dots across the game board's length (x-axis).
     * @function getDotCountLength
     * @returns {number}
     */
    function getDotCountLength() {
        return _dotCountLength;
    };

    /**
     * The number of boxes across the game board's length (x-axis).
     * @function getBoxCountLength
     * @returns {number}
     */
    function getBoxCountLength() {
        return _boxCountLength;
    };



    /**
     * The number of dots across the game board's width (y-axis).
     * @function getDotCountWidth
     * @returns {number}
     */
    function getDotCountWidth() {
        return _dotCountWidth;
    };

    /**
     * The number of boxes across the game board's width (y-axis).
     * @function getDotCountWidth
     * @returns {number}
     */
    function getBoxCountWidth() {
        return _boxCountWidth;
    };


    /**
     * Checks to see if a line has been connected already.
     * @function isLineConnected
     * @param {line}        line    - The line we wish to check.
     * @returns {boolean}           - Returns true if connected, false otherwise.
     */
    function isLineConnected(line) {
        return _lineSet.connected(line);
    }


//    /**
//     * Checks to see if the specified horizontal line is closed.
//     *
//     * @param   {number}    row     The row index of the h-line.
//     *                              Valid values are 0 to dotCountWidth-1.
//     *
//     * @param   {number}    col     The column index of the h-line.
//     *                              Valid values are 0 to boxCountLength-1.
//     *
//     * @returns {boolean}           true if the line is closed (connected),
//     *                              or false if the line is open.
//     */
//    function isHzLineClosed(row, col) {
//
//        var index = 0,
//            isClosed;
//
//        if((row < 0) || (row > (_dotCountWidth - 1))) {
//            throw new RangeError("row must be between 0 and dotCountWidth - 1.");
//        }
//
//        if((col < 0) || (col > (_boxCountLength - 1))) {
//            throw new RangeError("col must be between 0 and boxCountLength - 1.");
//        }
//
//        index = (row * _boxCountLength) + col;
//
//        isClosed = _horizontalLineStates[index];
//
//        return isClosed;
//
//    }


//    /**
//     * Checks to see if the specified vertical line is closed.
//     *
//     * @param   {number}    row     The row index of the v-line.
//     *                              Valid values are 0 to boxCountWidth-1.
//     *
//     * @param   {number}    col     The column index of the v-line.
//     *                              Valid values are 0 to dotCountLength-1.
//     *
//     * @returns {boolean}           true if the line is closed (connected),
//     *                              or false if the line is open.
//     */
//    function isVtLineClosed(row, col) {
//
//        var index = 0,
//            isClosed;
//
//        if((row < 0) || (row > (_boxCountWidth - 1))) {
//            throw new RangeError("row must be between 0 and boxCountWidth - 1.");
//        }
//
//        if((col < 0) || (col > (_dotCountLength - 1))) {
//            throw new RangeError("col must be between 0 and dotCountLength - 1.");
//        }
//
//        index = (row * getDotCountLength()) + col;
//
//        isClosed = _verticalLineStates[index];
//
//        return isClosed;
//
//    }



    /**
     * Validates the game configuration passed to the constructor.
     * and assigns member values.
     * @method
     * @param   {gameConfig}    The game configuration options.
     */
    function configureGame(config)
    {
        var i;

        if(!config) {
            config = {};
        }


        if(util.isNullOrUndefined(config.dotCountLength)) {
            _dotCountLength = DEFAULT_DOT_COUNT_LENGTH;
        } else {
            _dotCountLength = parseInt(config.dotCountLength);
        }

        if(util.isNullOrUndefined(config.dotCountWidth)) {
            _dotCountWidth = DEFAULT_DOT_COUNT_WIDTH;
        } else {
            _dotCountWidth = parseInt(config.dotCountWidth);
        }


       

        if(util.isNullOrUndefined(config.playerCount)) {
            _playerCount = DEFAULT_PLAYER_COUNT;
        } else {
            _playerCount = parseInt(config.playerCount);
        }

        if(util.isNullOrUndefined(config.startPlayer)) {
            _currentPlayer = DEFAULT_START_PLAYER
        } else {
            _currentPlayer = parseInt(config.startPlayer);
        }

        if(isNaN(_dotCountLength)) {
            throw new TypeError("dotCountLength is not a number.")
        }

        if(isNaN(_dotCountWidth)) {
            throw new TypeError("dotCountWidth is not a number.")
        }

        if(isNaN(_playerCount)) {
            throw new TypeError("playerCount is not a number.")
        }

        if(isNaN(_currentPlayer)) {
            throw new TypeError("startPlayer is not a number.")
        }

        if(_dotCountLength < 3) {
            throw new RangeError("dotCountLength must be three or more")
        }

        if(_dotCountWidth < 3) {
            throw new RangeError("dotCountWidth must be three or more")
        }

        if(_playerCount < 2) {
            throw new RangeError("playerCount must two or more")
        }

        if((_currentPlayer < 0) || (_currentPlayer >= _playerCount)) {
            throw new RangeError("startPlayer must be between 0 and playerCount-1")
        }


        _boxCountLength = _dotCountLength - 1;
        _boxCountWidth = _dotCountWidth - 1;

        _lineSet = util.lineSet(_dotCountLength, _dotCountWidth);


    }

    /**
     * Checks to see if the gameMove is a legit move.
     * Throws exceptions if the move is not valid.
     * @param {line}    line    - Specifies which line is being made as a game move.
     */
    function ensureValidMove(line) {

        //There are several validations going on here.
        //1.  lineSet.connected implicitly validates the line.
        //2.  We are checking if he line is already connected
        //    if so disallow the move.

        if(_lineSet.connected(line)) {
            throw new Error("This line is already connected.")
        }



    }




    return {

        getDotCountLength: getDotCountLength,
        getBoxCountLength: getBoxCountLength,
        getDotCountWidth: getDotCountWidth,
        getBoxCountWidth: getBoxCountWidth,
        getPlayerCount: getPlayerCount,
        getCurrentPlayer: getCurrentPlayer,
        isLineConnected: isLineConnected

    };

};

