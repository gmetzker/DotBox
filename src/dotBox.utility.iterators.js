
var dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};
dotBox.utility.iterators = dotBox.utility.iterators || {};

(function (namespace) {


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


}(dotBox.utility.iterators));