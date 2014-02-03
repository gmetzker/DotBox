/*global  $, jQuery, ko*/

var dotBox = dotBox || {};


dotBox.viewModel = (function () {


    var vm = {
        playerMode: ko.observable('pvc'),
        playerName1: ko.observable('PLAYER 1'),
        playerName2Custom: ko.observable('PLAYER 2'),
        dotCols: ko.observable(10),
        dotRows: ko.observable(6),
        quickGame: ko.observable(true),
        fillPercentCustom: ko.observable(30),
        uiScale: ko.observable(1.25),
        game: null
    };


    vm.useAi = ko.computed(function () {
        return vm.playerMode() === 'pvc';
    });


    vm.playerName2 = ko.computed({

        read: function () {
            if (vm.useAi()) {
                return "HAL9000";
            }

            return vm.playerName2Custom();

        },

        write: function (value) {
            if (!vm.useAi()) {
                vm.playerName2Custom(value);
            }
        }
    });



    vm.fillPercent = ko.computed({

        read: function () {

            if (vm.quickGame()) {
                return vm.fillPercentCustom();
            }
            return 0;

        },

        write: function (value) {

            if (vm.quickGame()) {
                vm.fillPercentCustom(value);
            }

        }
    });



    vm.toGameConfig = function () {

        var config = {
            dotColCount: vm.dotCols(),
            dotRowCount: vm.dotRows(),
            useAi: vm.useAi(),
            preMovePercent: vm.fillPercent() / 100,
            playerNames: [vm.playerName1(), vm.playerName2()],
            uiScale: vm.uiScale()
        };

        return config;

    };



    vm.newGame = function newGame() {

        if (!vm.isValid()) {
            $('#globalError').removeClass('hidden');
            return false;
        }

        $('#globalError').addClass('hidden');


        var $container = $('#canvasContainer'),
            config = vm.toGameConfig();

        if (vm.game !== null) {
            vm.game.stopGame();
        }

        $container.empty();

        vm.game = $container.dotBox(config);

        return true;

    };

    function validatePlayerName(name) {

        if (name === undefined || name === null) { return false; }

        if (name.length === 0 || name.length > 10) { return false; }

        return true;

    }

    vm.isP1NameValid = ko.computed(function () {
        return validatePlayerName(vm.playerName1());
    });

    vm.isP2NameValid = ko.computed(function () {
        return validatePlayerName(vm.playerName2());
    });

    vm.isDotColsValid = ko.computed(function () {

        if (vm.dotCols() < 6 || vm.dotCols() > 20) { return false; }

        return true;

    });

    vm.isDotRowsValid = ko.computed(function () {

        if (vm.dotRows() < 3 || vm.dotRows() > 20) { return false; }

        return true;

    });

    vm.isFillPercentValid = ko.computed(function () {

        if (vm.fillPercentCustom() < 1 || vm.fillPercentCustom() > 100) { return false; }

        return true;

    });

    vm.isValid = ko.computed(function () {

        if (!vm.isP1NameValid()) { return false; }
        if (!vm.isP2NameValid()) { return false; }
        if (!vm.isDotColsValid()) { return false; }
        if (!vm.isDotRowsValid()) { return false; }
        if (!vm.isFillPercentValid()) { return false; }

        return true;

    });


    return vm;

}());
