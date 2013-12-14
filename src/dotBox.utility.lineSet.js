var dotBox;
dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};

(function(namespace) {

    namespace.lineSet = function lineSet (dotCountLength, dotCountWidth) {

        var util = namespace,
            _horizontalLineStates = [],
            _verticalLineStates = [],
            hLineCount = (dotCountLength - 1) * dotCountWidth,
            vLineCount = (dotCountWidth - 1) * dotCountLength;


        for(i = 0; i < hLineCount; i++) {
            _horizontalLineStates[i] = false;
        }

        for(i = 0; i < vLineCount; i++) {
            _verticalLineStates[i] = false;
        }

        function getLineLookup(line) {

            var row,
                col,
                index,
                stateArr;

            if(util.line.isHLine(line)) {
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
            }

        }


        /**
         * Gets the current state of a line connection.  If connect is true
         * then the connection for the line is set to true.
         * @function  connected
         * @param {line}    line        - The line we are checking, or setting.
         * @param {boolean} connect     - True to connect the line, false will leave the previous state.
         * @returns {boolean}           - True if the line is connected, false if not connected.
         * @throws                      - Throws various errors if line is not valid.
         */
        function connected(line, connect)
        {
            var lineLookup,
                state;

            assertIsValidLine(line);

            lineLookup = getLineLookup(line);

            if(!util.isNullOrUndefined(connect)) {

                if(connect) {
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
         * @returns {boolean}               - True if the dot is valid, false if not.
         */
        function assertIsValidDot(dot, name) {

            if(util.isNullOrUndefined(dot)) {
                throw new Error(name + " is null or undefined.")
            }

            if( dot.x < 0 ) {
                throw new RangeError(name + ".x must be > 0.")
            }

            if( dot.x >= dotCountLength ) {
                throw new RangeError(name + ".x must be < " + dotCountLength);
            }

            if( dot.y < 0 ) {
                throw new RangeError(name + ".y must be > 0.")
            }

            if( dot.y >= dotCountWidth ) {
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

            if( util.isNullOrUndefined(line)) {
                throw new Error("line is null or undefined");
            }

            assertIsValidDot(line.d1, "line.d1");
            assertIsValidDot(line.d2, "line.d2");

            xDiff = Math.abs(line.d1.x - line.d2.x);
            yDiff = Math.abs(line.d1.y - line.d2.y);

            if(xDiff > 1) {
                throw new RangeError("Move appears to be too long on x-axis.  Line must only connect adjacent points.")
            }

            if(yDiff > 1) {
                throw new RangeError("Move appears to be too long on y-axis.  Line must only connect adjacent points.")
            }

            if((xDiff + yDiff) > 1) {
                throw new RangeError("Movement appears to be diagonal this is not allowed.")
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

            for(i = 0; i < 3; i++) {
                if(!connected(boxLines[i])) return false;
            }

            return true;
        }



        return {
            connected: connected,
            isBoxClosed: isBoxClosed
        };


    };

})(dotBox.utility);




