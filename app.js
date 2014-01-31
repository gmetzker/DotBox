/*global  $, jQuery, ko*/

var dotBox = dotBox || {};


dotBox.viewModel = (function () {


    var vm = {
        playerMode: ko.observable('pvc'),
        playerName1: ko.observable('PLAYER 1'),
        playerName2Custom: ko.observable('PLAYER 2'),
        dotCols: ko.observable(6),
        dotRows: ko.observable(6),
        quickGame: ko.observable(true),
        fillPercentCustom: ko.observable(30),
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
            playerNames: [vm.playerName1(), vm.playerName2()]
        };

        return config;

    };

    vm.newGame = function newGame() {

        var $container = $('#gameContainer'),
            config = vm.toGameConfig();

        $container.empty();
        if (vm.game !== null) {
            vm.game.stopGame();
        }

        vm.game = $container.dotBox(config);

    };


    return vm;



}());




$(document).ready(function () {

    ko.applyBindings(dotBox.viewModel);

    dotBox.viewModel.newGame();

});