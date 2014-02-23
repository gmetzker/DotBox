/*global  $, jQuery, ko, dotBox*/


$(document).ready(function () {

    $('.alert .close').on('click', function () {
        $(this).parent().addClass('hidden');
    });

    // Display an error if the browser doesn't support the canvas.
    if (!dotBox.utility.isCanvasSupported()) {
        $('#canvasContainer').addClass('hidden');
        $('#mainContainer').addClass('hidden');
        $('#failContainer').removeClass('hidden');
        return;
    }

    $('#newGameBtn').on('click', function () {

        if (dotBox.viewModel.newGame()) {
            $('html, body').animate({

                scrollTop: $("#canvasContainer").offset().top - 50
            }, 300);
        }




    });

    dotBox.ko.addCustomBindings();

    //Change the default dot size if the screen is large enough.
    if ($(window).width() > 510) {
        dotBox.viewModel.dotCols(10);
    } else {
        dotBox.viewModel.dotCols(6);
    }



    ko.applyBindings(dotBox.viewModel);

    dotBox.viewModel.newGame();


});