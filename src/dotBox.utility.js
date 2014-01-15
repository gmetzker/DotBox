var dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};

(function (namespace) {

    namespace.isNullOrUndefined = isNullOrUndefined;

    function isNullOrUndefined(value) {

        if (value === undefined) {
            return true;
        }

        return value === null;

    }

    /**
     * Checks to see if the two dots have the same x and y indexes.
     * @function areSameDot
     * @param {gameDot} dot1 - One of two dots to compare.
     * @param {gameDot} dot2 - Second of two dots to compare.
     * @returns {boolean}  - Returns true if the dots have the same x and y coordinates.
     */
    namespace.areSameDot = function areSameDot(dot1, dot2) {

        if (isNullOrUndefined(dot1) && isNullOrUndefined(dot2)) {
            return true;
        }

        if (isNullOrUndefined(dot1) !== isNullOrUndefined(dot2)) {
            return false;
        }

        return (dot1.x === dot2.x) && (dot1.y === dot2.y);

    };


    /**
     * Gets a random integer from in to max (inclusive).
     * @param {number} min  - The inclusive minimum value for the range.
     * @param {number} max  - The inclusive maximum value for the range.
     * @returns {number}    - A random integer in the range min to max.
     */
    namespace.getRandom = function getRandom(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    /**
     * Returns a random item in the array.
     * @param {*[]} arr - An array of stuff.
     * @returns {*}     - A random item in the array.
     */
    namespace.getRandomItem = function getRandomItem(arr) {

        var rIndex;

        rIndex = namespace.getRandom(0, arr.length - 1);
        return arr[rIndex];

    };




    namespace.hLineIterator = function hLineIterator(dotCountLength, dotCountWidth) {

        var colIndex = -1,
            rowIndex = 0,
            isComplete = false;

        function current() {

            if (isComplete) {
                return false;
            }

            return {
                d1: {x: colIndex, y: rowIndex},
                d2: {x: colIndex + 1, y: rowIndex}
            };

        }

        function isLastColumn() {
            return colIndex === dotCountLength - 2;
        }

        function isLastRow() {
            return rowIndex === dotCountWidth - 1;
        }

        function next() {

            if (isComplete) {
                return null;
            }

            if (isLastRow() && isLastColumn()) {

                isComplete = true;
                return null;

            }
            if (isLastColumn()) {
                rowIndex += 1;
                colIndex = 0;
            } else {
                colIndex += 1;
            }

            return current();

        }

        return {
            next: next,
            current: current
        };


    };

    namespace.vLineIterator = function vLineIterator(dotCountLength, dotCountWidth) {

        var colIndex = -1,
            rowIndex = 0,
            isComplete = false;

        function current() {

            if (isComplete) {
                return false;
            }

            return {
                d1: {x: colIndex, y: rowIndex},
                d2: {x: colIndex, y: rowIndex + 1}
            };

        }

        function isLastColumn() {
            return colIndex === dotCountLength - 1;
        }

        function isLastRow() {
            return rowIndex === dotCountWidth - 2;
        }

        function next() {

            if (isComplete) {
                return null;
            }

            if (isLastRow() && isLastColumn()) {
                isComplete = true;
                return null;
            }

            if (isLastColumn()) {
                rowIndex += 1;
                colIndex = 0;
            } else {
                colIndex += 1;
            }

            return current();

        }

        return {
            next: next,
            current: current
        };


    };


    namespace.inherit = (function () {
        var F = function () {};
        return function (C, P) {
            F.prototype = P.prototype;
            C.prototype = new F();
            C.uber = P.prototype;
            C.prototype.constructor = C;
        };
    }());


}(dotBox.utility));




