/*global describe, it, expect, dotBox */

var boxIterator = function boxIterator(dotCountLength, dotCountWidth) {

    var colIndex = -1,
        rowIndex = 0,
        isComplete = false,
        boxCountLength = dotCountLength - 1,
        boxCountWidth = dotCountWidth - 1;

    function current() {

        var boxIndex;

        if (isComplete) {
            return false;
        }

        boxIndex = (rowIndex * boxCountLength) + colIndex;
        return {boxIndex: boxIndex};

    }

    function isLastColumn() {
        return colIndex === boxCountLength - 1;
    }

    function isLastRow() {
        return rowIndex === boxCountWidth - 1;
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


describe("line iterator", function () {

    var hLineIterator = dotBox.utility.iterators.hLineIterator,
        vLineIterator = dotBox.utility.iterators.vLineIterator;

    it("for horizontal lines should iterate all horizontal lines", function () {

        var i,
            lDotCount = 3,
            wDotCount = 4,
            allIterationResults = [],
            line,
            hIt,
            EXP_RESULTS = [],
            EXP_RESULT_COUNT,
            current;

        hIt = hLineIterator(lDotCount, wDotCount);

        EXP_RESULTS.push({d1: {x: 0, y: 0}, d2: {x: 1, y: 0}});
        EXP_RESULTS.push({d1: {x: 1, y: 0}, d2: {x: 2, y: 0}});
        EXP_RESULTS.push({d1: {x: 0, y: 1}, d2: {x: 1, y: 1}});
        EXP_RESULTS.push({d1: {x: 1, y: 1}, d2: {x: 2, y: 1}});
        EXP_RESULTS.push({d1: {x: 0, y: 2}, d2: {x: 1, y: 2}});
        EXP_RESULTS.push({d1: {x: 1, y: 2}, d2: {x: 2, y: 2}});
        EXP_RESULTS.push({d1: {x: 0, y: 3}, d2: {x: 1, y: 3}});
        EXP_RESULTS.push({d1: {x: 1, y: 3}, d2: {x: 2, y: 3}});
        EXP_RESULT_COUNT = EXP_RESULTS.length;

        //noinspection JSHint,JSLint
        while (line = hIt.next()) {

            allIterationResults.push(line);

            current = hIt.current();

            expect(JSON.stringify(current))
                .toBe(JSON.stringify(line));
        }

        expect(allIterationResults.length).toBe(EXP_RESULT_COUNT);


        for (i = 0; i < EXP_RESULT_COUNT; i++) {
            expect(JSON.stringify(allIterationResults[i]))
                .toBe(JSON.stringify(EXP_RESULTS[i]));
        }


    });

    it("for vertical lines should iterate all vertical lines", function () {

        var i,
            lDotCount = 3,
            wDotCount = 4,
            allIterationResults = [],
            line,
            vIt,
            EXP_RESULTS = [],
            EXP_RESULT_COUNT,
            current;

        vIt = vLineIterator(lDotCount, wDotCount);

        EXP_RESULTS.push({d1: {x: 0, y: 0}, d2: {x: 0, y: 1}});
        EXP_RESULTS.push({d1: {x: 1, y: 0}, d2: {x: 1, y: 1}});
        EXP_RESULTS.push({d1: {x: 2, y: 0}, d2: {x: 2, y: 1}});

        EXP_RESULTS.push({d1: {x: 0, y: 1}, d2: {x: 0, y: 2}});
        EXP_RESULTS.push({d1: {x: 1, y: 1}, d2: {x: 1, y: 2}});
        EXP_RESULTS.push({d1: {x: 2, y: 1}, d2: {x: 2, y: 2}});

        EXP_RESULTS.push({d1: {x: 0, y: 2}, d2: {x: 0, y: 3}});
        EXP_RESULTS.push({d1: {x: 1, y: 2}, d2: {x: 1, y: 3}});
        EXP_RESULTS.push({d1: {x: 2, y: 2}, d2: {x: 2, y: 3}});

        EXP_RESULT_COUNT = EXP_RESULTS.length;

        //noinspection JSHint,JSLint
        while (line = vIt.next()) {
            allIterationResults.push(line);

            current = vIt.current();

            expect(JSON.stringify(current))
                .toBe(JSON.stringify(line));
        }

        expect(allIterationResults.length).toBe(EXP_RESULT_COUNT);


        for (i = 0; i < EXP_RESULT_COUNT; i++) {
            expect(JSON.stringify(allIterationResults[i]))
                .toBe(JSON.stringify(EXP_RESULTS[i]));
        }


    });

});

describe("box iterator", function () {

    it("should return 9 ordered indexes for a game size of 4x4 (sized in dots)", function () {

        var i,
            bIt,
            box,
            actualIndexes = [],
            EXP_BOX_COUNT = 9;

        bIt = boxIterator(4, 4);

        //noinspection JSHint,JSLint
        while (box = bIt.next()) {
            actualIndexes.push(box.boxIndex);
        }

        expect(actualIndexes.length).toBe(EXP_BOX_COUNT);

        for (i = 0; i < EXP_BOX_COUNT; i++) {
            expect(actualIndexes[i]).toBe(i);
        }

    });

    it("should return 6 ordered indexes for a game size of 3x4 (sized in dots)", function () {

        var i,
            bIt,
            box,
            actualIndexes = [],
            EXP_BOX_COUNT = 6;

        bIt = boxIterator(3, 4);

        //noinspection JSHint,JSLint
        while (box = bIt.next()) {
            actualIndexes.push(box.boxIndex);
        }

        expect(actualIndexes.length).toBe(EXP_BOX_COUNT);

        for (i = 0; i < EXP_BOX_COUNT; i++) {
            expect(actualIndexes[i]).toBe(i);
        }

    });
});
