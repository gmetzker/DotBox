var dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};

(function (namespace) {

    namespace.isNullOrUndefined = function (value) {

        if (value === undefined) {
            return true;
        }

        return value === null;




    };

}(dotBox.utility));




