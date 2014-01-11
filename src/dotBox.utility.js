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

}(dotBox.utility));




