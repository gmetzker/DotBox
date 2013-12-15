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
        _lineState,
        _boxState;


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

        if(isGameOver()) {
            return null;
        } else {
            return _currentPlayer;
        }
    }

    /**
     * Advances the _currentPlayer to the next.
     * @function    nextPlayer
     * @returns {number}    - The number of the next player.
     */
    function nextPlayer() {

        if(isGameOver()) {
            return null;
        }

        if(_currentPlayer === _playerCount - 1) {
            _currentPlayer = 0;
        }
        else {
            _currentPlayer += 1;
        }

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
     * Calculates the total number of boxes on the board.
     * @function    getBoxCount
     * @returns {number}         - BoxCountWidth X BoxCountLength
     */
    function getBoxCount() {
        return getBoxCountLength() * getBoxCountWidth();
    }


    /**
     * Checks to see if a line has been connected already.
     * @function isLineConnected
     * @param {line}        line    - The line we wish to check.
     * @returns {boolean}           - Returns true if connected, false otherwise.
     */
    function isLineConnected(line) {
        return _lineState.connected(line);
    }

    /**
     * Determines if all boxes are claimed and the game is over.
     * @function isGameOver
     * @returns {boolean}   - True if the game is over, false otherwise.
     */
    function isGameOver() {

        return _boxState.areAllBoxesScored();

    }


    /**
     * Validates the game configuration passed to the constructor.
     * and assigns member values.
     * @method
     * @param   {gameConfig}    The game configuration options.
     */
    function configureGame(config)
    {
        var i,
            boxCount;

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

        configureDependencies(config);

    }

    function configureDependencies(config) {


        // BOX STATE

        if( !util.isNullOrUndefined(config.boxState)) {

            //If we have a box state then assign it.
             _boxState = config.boxState;

        } else {

            //Default boxState.
            _boxState = dotBox.boxState(_dotCountLength, _dotCountWidth);

        }

        // LINE SET

        if( !util.isNullOrUndefined(config.lineState)) {

            //If we have a line set then assign it.
            _lineState = config.lineState;


        } else {

            //Assign the default line set.
            _lineState = dotBox.lineState(_dotCountLength, _dotCountWidth);

        }




    }

    /**
     * Checks to see if the gameMove is a legit move.
     * Throws exceptions if the move is not valid.
     * @param {line}    line    - Specifies which line is being made as a game move.
     */
    function ensureValidMove(line) {

        //There are several validations going on here.
        //1.  _lineState.connected implicitly validates the line.
        //2.  We are checking if he line is already connected
        //    if so disallow the move.

        if(_lineState.connected(line)) {
            throw new Error("This line is already connected.")
        }



    }




    function connectLine(line) {

        var adjacentBoxes,
            closedBoxesThisTurn,
            result = {},
            playerThisTurn;

        if(isGameOver()) {
            throw new Error("Cannot make a move when the game is over.");
        }

        ensureValidMove(line);

        playerThisTurn = getCurrentPlayer();

        _lineState.connected(line, true);

        //Get any boxes this line is a part of.
        adjacentBoxes = util.line.getBoxesFromLine(line, _dotCountLength, _dotCountWidth);

        //Check to see if any of the boxes
        //are now closed or and unclaimed.
        //If so then these are new scores for the player.
        closedBoxesThisTurn = adjacentBoxes
            .filter(_lineState.isBoxClosed)
            .filter(_boxState.isBoxUnscored);

        //Record these boxes for the current player.
        closedBoxesThisTurn.forEach(function(boxIndex) {
            _boxState.scoreBox(boxIndex, playerThisTurn);
        });

        result.boxesScored = closedBoxesThisTurn;
        result.gameOver = isGameOver();

        if(result.boxesScored.length === 0) {
            //If no boxes were scored then advance
            //to the next player, and assign it to.
            result.nextPlayer = nextPlayer();
        } else {
            result.nextPlayer = getCurrentPlayer();
        }

        return result;

    }

    /**
     * Returns the number of boxes scored for each player.
     * @function                getCurrentScores
     * @returns     {number[]}                 - An array where each position corresponds to the
     *                                           ordinal of the playerIndex and the value is a
     *                                           count of the number of boxes scored.
     */
    function getCurrentScores() {
        return _boxState.getCurrentScores(_playerCount);
    }




    return {

        getDotCountLength: getDotCountLength,
        getBoxCountLength: getBoxCountLength,
        getDotCountWidth: getDotCountWidth,
        getBoxCountWidth: getBoxCountWidth,
        getBoxCount: getBoxCount,
        getPlayerCount: getPlayerCount,
        getCurrentPlayer: getCurrentPlayer,
        getCurrentScores: getCurrentScores,
        isLineConnected: isLineConnected,
        connectLine: connectLine,
        isGameOver: isGameOver

    };

};

