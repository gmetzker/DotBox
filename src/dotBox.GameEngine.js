
var dotBox;

dotBox = dotBox || {};

/**
 * Game configuration options.
 * @typedef     {Object}    gameConfig
 * @property    {number}    dotCountLength     - The number of game dots across the length (x-axis) of the board.
 * @property    {number}    dotCountWidth      - The number of game dots across the width (y-axis) of the board.
 * @property    {number}    playerCount        - The number of players.
 *
 */

/**
 * Creates a new game engine.
 * @function gameEngine
 * @param   {gameConfig}    - The game configuration options.
 */
dotBox.gameEngine = function gameEngine(config) {

    var DEFAULT_PLAYER_COUNT = 2,
        DEFAULT_DOT_COUNT_LENGTH = 10,
        DEFAULT_DOT_COUNT_WIDTH = 10,
        _playerCount,
        _dotCountLength,
        _dotCountWidth,
        _boxCountLength,
        _boxCountWidth,
        _lineCountHorizontal,
        _lineCountVertical,
        _horizontalLineStates,
        _verticalLineStates,
        i;



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
     * The number of connector lines that can be placed horizontally.
     * @function getLineCountHorizontal
     * @returns {number}
     */
    function getLineCountHorizontal() {
        return _lineCountHorizontal;
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
     * The number of connector lines that can be placed vertically.
     * @function getLineCountVertical
     * @returns {number}
     */
    function getLineCountVertical() {
        return _lineCountVertical;
    };


    /**
     * Checks to see if the specified horizontal line is closed.
     *
     * @param   {number}    row     The row index of the h-line.
     *                              Valid values are 0 to dotCountWidth-1.
     *
     * @param   {number}    col     The column index of the h-line.
     *                              Valid values are 0 to boxCountLength-1.
     *
     * @returns {boolean}           true if the line is closed (connected),
     *                              or false if the line is open.
     */
    function isHzLineClosed(row, col) {

        var index = 0,
            isClosed;

        if((row < 0) || (row > (_dotCountWidth - 1))) {
            throw new RangeError("row must be between 0 and dotCountWidth - 1.");
        }

        if((col < 0) || (col > (_boxCountLength - 1))) {
            throw new RangeError("col must be between 0 and boxCountLength - 1.");
        }

        index = (row * _boxCountLength) + col;

        isClosed = _horizontalLineStates[index];

        return isClosed;

    }


    /**
     * Checks to see if the specified vertical line is closed.
     *
     * @param   {number}    row     The row index of the v-line.
     *                              Valid values are 0 to boxCountWidth-1.
     *
     * @param   {number}    col     The column index of the v-line.
     *                              Valid values are 0 to dotCountLength-1.
     *
     * @returns {boolean}           true if the line is closed (connected),
     *                              or false if the line is open.
     */
    function isVtLineClosed(row, col) {

        var index = 0,
            isClosed;

        if((row < 0) || (row > (_boxCountWidth - 1))) {
            throw new RangeError("row must be between 0 and boxCountWidth - 1.");
        }

        if((col < 0) || (col > (_dotCountLength - 1))) {
            throw new RangeError("col must be between 0 and dotCountLength - 1.");
        }

        index = (row * getDotCountLength()) + col;

        isClosed = _verticalLineStates[index];

        return isClosed;

    }



    /**
     * Validates the game configuration passed to the constructor.
     * and assigns member values.
     * @method
     * @param   {gameConfig}    The game configuration options.
     */
    function configureGame(config)
    {
        if(!config) {
            config = {};
        }


        if(config.dotCountLength === undefined || config.dotCountLength === null) {
            _dotCountLength = DEFAULT_DOT_COUNT_LENGTH;
        } else {
            _dotCountLength = parseInt(config.dotCountLength);
        }

        if(config.dotCountWidth === undefined || config.dotCountWidth === null) {
            _dotCountWidth = DEFAULT_DOT_COUNT_WIDTH;
        } else {
            _dotCountWidth = parseInt(config.dotCountWidth);
        }


       

        if(config.playerCount === undefined || config.playerCount === null) {
            _playerCount = DEFAULT_PLAYER_COUNT;
        } else {
            _playerCount = parseInt(config.playerCount);
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

        if(_dotCountLength < 3) {
            throw new RangeError("dotCountLength must be three or more")
        }

        if(_dotCountWidth < 3) {
            throw new RangeError("dotCountWidth must be three or more")
        }

        if(_playerCount < 2) {
            throw new RangeError("playerCount must two or more")
        }


        _boxCountLength = _dotCountLength - 1;
        _boxCountWidth = _dotCountWidth - 1;

        _lineCountHorizontal = _boxCountLength  * _dotCountWidth;
        _lineCountVertical = _boxCountWidth * _dotCountLength;

        _horizontalLineStates = [];
        for(i = 0; i < _lineCountHorizontal; i++) {
            _horizontalLineStates[i] = false;
        }

        _verticalLineStates = [];
        for(i = 0; i < _lineCountVertical; i++) {
            _verticalLineStates[i] = false;
        }

    }







    return {

        getDotCountLength: getDotCountLength,
        getBoxCountLength: getBoxCountLength,
        getLineCountHorizontal: getLineCountHorizontal,
        getLineCountVertical: getLineCountVertical,
        getDotCountWidth: getDotCountWidth,
        getBoxCountWidth: getBoxCountWidth,
        getPlayerCount: getPlayerCount,
        isHzLineClosed: isHzLineClosed,
        isVtLineClosed: isVtLineClosed

    };

};

