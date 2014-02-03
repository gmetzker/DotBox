/*global  $, jQuery, ko, dotBox*/

var dotBox = dotBox || {};
dotBox.ko = dotBox.ko || {};

dotBox.ko.addCustomBindings = function addCustomBindings() {

    // Add a cusotm binding to the JQuery UI slider.
    ko.bindingHandlers.slider = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().sliderOptions || {};
            $(element).slider(options);
            ko.utils.registerEventHandler(element, "slidechange", function (event, ui) {
                var observable = valueAccessor();
                observable(ui.value);
            });
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).slider("destroy");
            });
            ko.utils.registerEventHandler(element, "slide", function (event, ui) {
                var observable = valueAccessor();
                observable(ui.value);
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            if (isNaN(value)) { value = 0; }
            $(element).slider("value", value);

        }
    };

};