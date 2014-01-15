var dotBox = dotBox || {};

dotBox.lineState = function lineState(dotCountLength, dotCountWidth) {

    var util = dotBox.utility,
        _horizontalLineStates = [],
        _verticalLineStates = [],
        that;

    that = {
        connected: connected,
        isBoxClosed: isBoxClosed,
        getAllLinesForDot: getAllLinesForDot,
        getOpenLinesForDot: getOpenLinesForDot,
        getTotalLineCount: getTotalLineCount,
        getLineStatesForBox: getLineStatesForBox
    };

    configure(dotCountLength, dotCountWidth);


    function configure(dotLength, dotWidth) {

        var i,
            hLineCount,
            vLineCount;

        hLineCount = (dotLength - 1) * dotWidth;
        vLineCount = (dotWidth - 1) * dotLength;


        for (i = 0; i < hLineCount; i++) {
            _horizontalLineStates[i] = false;
        }

        for (i = 0; i < vLineCount; i++) {
            _verticalLineStates[i] = false;
        }

    }


    function getLineLookup(line) {

        var row,
            col,
            index,
            stateArr;

        if (util.line.isHLine(line)) {
            //Horizontal Line
            stateArr = _horizontalLineStates;

            row = line.d1.y;
            col = Math.min(line.d1.x, line.d2.x);
            index = (row * (dotCountLength - 1)) + col;

        } else {
            //Vertical Line.
            stateArr = _verticalLineStates;
            row = Math.min(line.d1.y, line.d2.y);
            col = line.d1.x;
            index = (row * dotCountLength) + col;
        }

        return {
            index: index,
            stateArray: stateArr
        };

    }


    /**
     * Gets the current state of a line connection.  If connect is true
     * then the connection for the line is set to true.
     * @function  connected
     * @param {line}    line        - The line we are checking, or setting.
     * @param {boolean=} connect     - True to connect the line, false will leave the previous state.
     * @returns {boolean}           - True if the line is connected, false if not connected.
     * @throws                      - Throws various errors if line is not valid.
     */
    function connected(line, connect) {
        var lineLookup,
            state;

        assertIsValidLine(line);

        lineLookup = getLineLookup(line);

        if (!util.isNullOrUndefined(connect)) {

            if (connect) {
                lineLookup.stateArray[lineLookup.index] = true;
            }
        }

        state = lineLookup.stateArray[lineLookup.index];

        return state;
    }



    /**
     * Check the dot to see if it is valid.
     * @function            isValidDot
     * @param   {gameDot}   dot         - The got we are checking.
     * @param   {string}    name        - Identifier to use in any exceptions.
     * @returns {boolean}               - True if the dot is valid, false if not.
     */
    function assertIsValidDot(dot, name) {

        if (util.isNullOrUndefined(dot)) {
            throw new Error(name + " is null or undefined.");
        }

        if (dot.x < 0) {
            throw new RangeError(name + ".x must be > 0.");
        }

        if (dot.x >= dotCountLength) {
            throw new RangeError(name + ".x must be < " + dotCountLength);
        }

        if (dot.y < 0) {
            throw new RangeError(name + ".y must be > 0.");
        }

        if (dot.y >= dotCountWidth) {
            throw new RangeError(name + ".y must be < " + dotCountWidth);
        }

    }


    /**
     * @function            assertIsValidLine
     * @param   {line}      line                - The line we are validating.
     * @returns {boolean}                       - True if line is valid, false otherwise.
     */
    function assertIsValidLine(line) {

        var xDiff,
            yDiff;

        if (util.isNullOrUndefined(line)) {
            throw new Error("line is null or undefined");
        }

        assertIsValidDot(line.d1, "line.d1");
        assertIsValidDot(line.d2, "line.d2");

        xDiff = Math.abs(line.d1.x - line.d2.x);
        yDiff = Math.abs(line.d1.y - line.d2.y);

        if (xDiff > 1) {
            throw new RangeError("Move appears to be too long on x-axis.  Line must only connect adjacent points.");
        }

        if (yDiff > 1) {
            throw new RangeError("Move appears to be too long on y-axis.  Line must only connect adjacent points.");
        }

        if ((xDiff + yDiff) > 1) {
            throw new RangeError("Movement appears to be diagonal this is not allowed.");
        }


    }

    /**
     * Checks to see if the the four sides of the box
     * are all in a connected state.
     * @function            isBoxClosed
     * @param   {number}    boxIndex    - The box index we are checking.
     * @returns {boolean}               - True if all four lines are connected, false otherwise.
     */
    function isBoxClosed(boxIndex) {

        var i,
            boxLines;

        boxLines = util.line.getLinesFromBox(boxIndex, dotCountLength);

        for (i = 0; i < 4; i++) {
            if (!connected(boxLines[i])) { return false; }
        }

        return true;
    }

    /**
     * Gets the set of all lines could connect or are connected to the given dot.
     * @function             getAllLinesForDot
     * @param   {gameDot}    dot  - The dot who's lines we are returning.
     * @returns {line[]}            - A list of lines that can connect to the dot.
     *                            Corner dots have two lines.
     *                            Edge dots have three lines.
     *                            Interior dots have four lines.
     */
    function getAllLinesForDot(dot) {

        var allLines = [],
            cloneDot,
            addLine;

        cloneDot = function () {
            return {x: dot.x, y: dot.y};
        };

        addLine = function (x, y) {
            allLines.push({
                d1: cloneDot(),
                d2: {
                    x:  x,
                    y:  y
                }
            });
        };



        // If there is a dot ABOVE of the current dot.
        if (dot.y > 0) {
            addLine(dot.x, dot.y - 1);
        }

        // If there is a dot to the RIGHT of the current dot.
        if (dot.x < (dotCountLength - 1)) {
            addLine(dot.x + 1, dot.y);
        }

        // If there is a dot BELOW the current dot.
        if (dot.y < (dotCountWidth - 1)) {
            addLine(dot.x, dot.y + 1);
        }

        // If there is a dot to the LEFT of the current dot.
        if (dot.x > 0) {
            addLine(dot.x - 1, dot.y);
        }

        return allLines;

    }


    /**
     * Finds all of the open (not-connected) lines that this dot could connected to.
     * @function            getOpenLinesForDot
     * @param   {gameDot}   dot
     * @returns {line[]}    Returns an array of all unconnected lines for this dot.
     */
    function getOpenLinesForDot(dot) {

        var allLines,
            openLines;

        allLines = that.getAllLinesForDot(dot);
        openLines = allLines.filter(function (line) {
            return !that.connected(line);
        });

        return openLines;

    }

    function getTotalLineCount() {
        return _verticalLineStates.length + _horizontalLineStates.length;
    }

    function getLineStatesForBox(boxIndex) {

        var allLines,
            open = [],
            closed = [],
            lIndex,
            tempLine;

        allLines = dotBox.utility.line.getLinesFromBox(boxIndex, dotCountLength);

        for (lIndex = 0; lIndex < 4; lIndex++) {

            tempLine = allLines[lIndex];
            if (that.connected(tempLine)) {
                closed.push(tempLine);
            } else {
                open.push(tempLine);
            }

        }

        return {
            open: open,
            closed: closed
        };

    }



    return that;


};



