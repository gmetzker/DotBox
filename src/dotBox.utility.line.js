var dotBox;
dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};
dotBox.utility.line = dotBox.utility.line || {};

(function(namespace){

    /**
     * Checks to see if the line is horizontal.
     * @function          isHLine
     * @param      {line} line      - The line we are checking.
     * @returns                     - True if the line is horizontal, false if vertical.
     */
    function isHLine(line) {

        if(Math.abs(line.d1.x - line.d2.x) > 0) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * Given a line this will find one or two boxes that the line is part of.
     * @function        getBoxesFromLine
     * @param {line}    line            - The line we are checking.
     * @param {number}  dotCountLength  - The total number of dots of the game board across the x-axis.
     */
    function getBoxesFromLine(line, dotCountLength, dotCountWidth) {

        var boxCountLength = dotCountLength - 1,
            boxes = [],
            topLeftDot = {};

        function boxIndex() {
            return (topLeftDot.y * boxCountLength) + topLeftDot.x;
        }

        if(isHLine(line)) {

            //If it's horizontal then y is the same for both dots.
            topLeftDot.y = line.d1.y;

            //Find the min x to get the left-most
            topLeftDot.x = Math.min(line.d1.x, line.d2.x);


            if( line.d1.y === 0 ) {

                //Line is on the top edge so we can only get the box below.
                boxes.push(boxIndex());

            } else if( line.d1.y === dotCountWidth - 1 ) {

                //Line is on the bottom edge so we can only get the box above.
                topLeftDot.y -= 1;
                boxes.push(boxIndex());

            } else {

                //Box is interior so get both.
                //Box Below
                boxes.push(boxIndex());

                //Box Above
                topLeftDot.y -= 1;
                boxes.push(boxIndex());
            }


        } else {
            // Vertical line

            //If it's vertical then x is the same for both dots.
            topLeftDot.x = line.d1.x;

            //Find the min y to get the top-most
            topLeftDot.y = Math.min(line.d1.y, line.d2.y);


            if( line.d1.x === 0 ) {

                //Line is on the left edge so we can only get the box to the right.
                boxes.push(boxIndex());

            } else if( line.d1.x === dotCountLength - 1 ) {

                //Line is on the right edge so we can only get the box to the left.
                topLeftDot.x -= 1;
                boxes.push(boxIndex());

            } else {

                //Box is interior so get both.
                //Box Right
                boxes.push(boxIndex());

                //Box Left
                topLeftDot.x -= 1;
                boxes.push(boxIndex());
            }

        }


        return boxes;



    }



    namespace.isHLine = isHLine;
    namespace.getBoxesFromLine = getBoxesFromLine;


})(dotBox.utility.line);

