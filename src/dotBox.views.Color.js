var dotBox = dotBox || {};
dotBox.views = dotBox.views || {};

dotBox.views.Color = (function Color() {

    //noinspection JSHint,JSLint
    var Color;

    //noinspection JSLint
    Color = function Color(colorCode) {

        var strArg;

        if (!(this instanceof Color)) {
            //Pass arguments to this constructor.
            return Color.apply(new Color(), arguments);
        }


        //noinspection JSPotentiallyInvalidUsageOfThis
        this.red = 255;
        //noinspection JSPotentiallyInvalidUsageOfThis
        this.blue = 255;
        //noinspection JSPotentiallyInvalidUsageOfThis
        this.green = 255;
        //noinspection JSPotentiallyInvalidUsageOfThis
        this.alpha = 1;

        if (arguments.length === 1) {

            strArg = colorCode.toString();

            return parseColorString(strArg);

        }


        if (arguments.length === 4) {

            //Parse for all four rgba codes.
            return parseFourArgs(arguments);

        }

        if (arguments.length === 3) {

            //Parse for rgb codes
            return parseThreeArgs(arguments);
        }

        if (arguments.length !== 0) {

            //Weird number of arguments, throw it out.
            throw new Error(arguments.length + ' number of arguments not supported.');
        }


    };


    Color.parseHexColorString = parseHexColorString;

    Color.parseColorString = parseColorString;

    Color.parseRgbaColorString = parseRgbaColorString;

    Color.parseRgbColorString = parseRgbColorString;

    function parseHexColorString(value) {
        var r, g, b,
            result;

        r = parseInt(value.slice(1, 3), 16);
        g = parseInt(value.slice(3, 5), 16);
        b = parseInt(value.slice(5, 7), 16);

        result = new Color();
        result.red = r;
        result.green = g;
        result.blue = b;

        return result;
    }

    function parseRgbaColorString(value) {

        var r, g, b, a,
            result,
            comps;

        value = value.trim();
        value = value.toLowerCase();

        //Remove leading 'rgba(' and trailing ')'
        value = value.slice(5, value.length - 1);
        value = value.trim();

        comps = value.split(',');

        if (comps.length !== 4) {
            throw new Error("Could not parse rgba() color string.");
        }

        r = parseInt(comps[0].trim(), 10);
        g = parseInt(comps[1].trim(), 10);
        b = parseInt(comps[2].trim(), 10);
        a = parseFloat(comps[3].trim());

        result = new Color();
        result.red = r;
        result.green = g;
        result.blue = b;
        result.alpha = a;

        return result;



    }

    function parseRgbColorString(value) {

        var r, g, b,
            result,
            comps;

        value = value.trim();
        value = value.toLowerCase();

        //Remove leading 'rgb(' and trailing ')'
        value = value.slice(4, value.length - 1);
        value = value.trim();

        comps = value.split(',');

        if (comps.length !== 3) {
            throw new Error("Could not parse rgb() color string.");
        }

        r = parseInt(comps[0].trim(), 10);
        g = parseInt(comps[1].trim(), 10);
        b = parseInt(comps[2].trim(), 10);

        result = new Color();
        result.red = r;
        result.green = g;
        result.blue = b;

        return result;



    }

    function parseFourArgs(args) {

        var result,
            r,
            g,
            b,
            a;

        r = Math.round(parseFloat(args[0]));
        g = Math.round(parseFloat(args[1]));
        b = Math.round(parseFloat(args[2]));
        a = parseFloat(args[3]);

        result = new Color();
        result.red = r;
        result.green = g;
        result.blue = b;
        result.alpha = a;

        return result;

    }

    function parseThreeArgs(args) {

        var result,
            r,
            g,
            b;

        r = Math.round(parseFloat(args[0]));
        g = Math.round(parseFloat(args[1]));
        b = Math.round(parseFloat(args[2]));

        result = new Color();
        result.red = r;
        result.green = g;
        result.blue = b;

        return result;

    }

    function parseColorString(value) {

        value = value.trim();

        if ((value.lastIndexOf('#', 0) === 0) && (value.length === 7)) {

            //If it begins with a hash tag then assume it's an HTML color code.
            return parseHexColorString(value);


        }
        if (value.lastIndexOf('rgba(', 0) === 0) {

            //Parse rgba(r,g,b,a) format.
            return parseRgbaColorString(value);

        }

        if (value.lastIndexOf('rgb(', 0) === 0) {

            //Parse rgb(r,g,b) format.
            return parseRgbColorString(value);

        }

        throw new Error('Invalid arguments.');


    }




    Color.prototype.toString = function toString() {

        var r, g, b;
        r = Math.round(this.red);
        g = Math.round(this.green);
        b = Math.round(this.blue);

        return 'rgba(' + ([r, g, b, this.alpha]).join() + ")";

    };

    Color.prototype.clone = function clone() {

        var colorClone = new Color();

        colorClone.red = this.red;
        colorClone.green = this.green;
        colorClone.blue = this.blue;
        colorClone.alpha = this.alpha;

        return colorClone;

    };

    return Color;


}());