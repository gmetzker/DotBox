var dotBox;
dotBox = dotBox || {};
dotBox.utility = dotBox.utility || {};

(function(namespace) {

    namespace.isNullOrUndefined = function (value) {

        if(value === undefined) {
            return true;
        }

        if(value === null) {
            return true;
        }

        return false;


    };

})(dotBox.utility);




