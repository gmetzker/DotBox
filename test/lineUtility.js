
var hLineIterator = function hLineIterator(dotCountLength, dotCountWidth) {

    var colIndex = -1,
        rowIndex = 0,
        isComplete = false;

    function current() {

        if(isComplete) return false;

        return {
            d1 : {x: colIndex, y: rowIndex},
            d2 : {x: colIndex + 1, y: rowIndex}
        }

    }

    function isLastColumn() {
        return colIndex === dotCountLength - 2;
    }

    function isLastRow() {
        return rowIndex === dotCountWidth - 1
    }

    function next() {

        if(isComplete) return null;

        if(isLastRow() && isLastColumn()) {
            isComplete = true;
            return null;
        } else if(isLastColumn()) {
            rowIndex +=1 ;
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

var vLineIterator = function hLineIterator(dotCountLength, dotCountWidth) {

    var colIndex = -1,
        rowIndex = 0,
        isComplete = false;

    function current() {

        if(isComplete) return false;

        return {
            d1 : {x: colIndex, y: rowIndex},
            d2 : {x: colIndex, y: rowIndex + 1}
        }

    }

    function isLastColumn() {
        return colIndex === dotCountLength - 1;
    }

    function isLastRow() {
        return rowIndex === dotCountWidth - 2
    }

    function next() {

        if(isComplete) return null;

        if(isLastRow() && isLastColumn()) {
            isComplete = true;
            return null;
        } else if(isLastColumn()) {
            rowIndex +=1 ;
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

       while(line = hIt.next())
       {
           allIterationResults.push(line);

           current = hIt.current();

           expect(JSON.stringify(current))
               .toBe(JSON.stringify(line));
       }

       expect(allIterationResults.length).toBe(EXP_RESULT_COUNT);



       for(i = 0; i < EXP_RESULT_COUNT; i++) {
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

        while(line = vIt.next())
        {
            allIterationResults.push(line);

            current = vIt.current();

            expect(JSON.stringify(current))
                .toBe(JSON.stringify(line));
        }

        expect(allIterationResults.length).toBe(EXP_RESULT_COUNT);



        for(i = 0; i < EXP_RESULT_COUNT; i++) {
            expect(JSON.stringify(allIterationResults[i]))
                .toBe(JSON.stringify(EXP_RESULTS[i]));
        }


    });

});


