var dotBox;
dotBox = dotBox || {};

dotBox.boxState = function (dotCountLength, dotCountWidth) {

    /**
     * @member {number[]}   _boxStates   - This is an array that matches up with the number of boxes.
     * - The index in the array is the box index, and the value is the index of the player
     * - if the box was scored.  If the value is null then no player has yet scored it.
     */
    var _boxStates;

    configure(dotCountLength, dotCountWidth);


    function configure(dotLength, dotWidth) {

        var i,
            boxCount = (dotLength - 1) * (dotWidth - 1),
            result;

        _boxStates = [];

        //Initialize with all null states.
        //Indicating no player has claimed a box.
        for(i = 0; i < boxCount; i++) {
            _boxStates[i] = null;
        }

    }




    /**
     * Returns the total number of boxes.
     * @function            getBoxCount
     * @returns {number}    - The number of configured boxes.
     */
    function getBoxCount()  {

        return _boxStates.length;

    }

    /**
     * Tests if the boxIndex is in the valid range.
     * @method assertIsValidBoxIndex
     * @param {number}  boxIndex    - The index being tested.
     * @throws {RangeError}         - Throws when boxIndex < 0, or >= boxCount.
     */
    function assertIsValidBoxIndex(boxIndex) {

        var boxCount = getBoxCount();
        if(boxIndex < 0) {
            throw new RangeError("boxIndex must be greater or equal to 0.")
        } else if(boxIndex >= boxCount) {
            throw new RangeError("boxIndex must be less than the box count (" + boxCount + ").")
        }
    }

    /**
     * Checks to see if a box is scored by a player (and is closed).
     * @function        isBoxScored
     * @param {number}  boxIndex    - The index of the box that we are checking.
     * @returns {boolean}           - true if the box is already scored/closed,
     *                                false if the box is unscored/open.
     */
    function isBoxScored(boxIndex) {

        assertIsValidBoxIndex(boxIndex);


        if( _boxStates[boxIndex] !== null ) {
            return true;
        } else {
            return false;
        }


    }

    /**
     * Checks to see if the box is open/unscored.
     * @function              isBoxUnscored
     * @param   {number}      boxIndex   - The box index we are checking.
     * @returns {boolean}                - true if the box is unscored/open
     *                                   - false if the box is scored/closed
     */
    function isBoxUnscored(boxIndex) {

        return !isBoxScored(boxIndex);

    }


    /**
     * @function          whichPlayerScoredBox
     * @param   {number}  boxIndex  - The index of the box we are checking to see
     *                                which player might have scored it.
     * @returns {number}            - Returns null if no player has scored the box,
     *                                otherwise returns the index of the player.
     */
    function whichPlayerScoredBox(boxIndex) {

        assertIsValidBoxIndex(boxIndex);

        return _boxStates[boxIndex];
    }

    /**
     * Marks the box as scored by the supplied playerIndex.
     * @method                   scoreBox
     * @param       {number}       boxIndex
     * @param       {number}       playerIndex
     */
    function scoreBox(boxIndex, playerIndex) {

        assertIsValidBoxIndex(boxIndex);

        _boxStates[boxIndex] = playerIndex;

    }

    /**
     * Checks to see if all boxes are scored/closed.
     * @returns {boolean}   - True if all boxes are scored, false if any
     *                        box is unscored.
     */
    function areAllBoxesScored() {

        var isScored = function isScored(playerIndex) {

            if(playerIndex === null) {
                return false;
            } else {
                return true;
            }

        }

        return _boxStates.every(isScored);
    }



    return {

        getBoxCount: getBoxCount,
        areAllBoxesScored: areAllBoxesScored,
        isBoxScored: isBoxScored,
        isBoxUnscored: isBoxUnscored,
        whichPlayerScoredBox: whichPlayerScoredBox,
        scoreBox: scoreBox

    };




};