module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        uglify: {
            js: {
                options: {
                    sourceMap: true,
                    compress: {
                        drop_console: true
                    }
                },
                files: {
                    'lib/dotBox-min.js' : [
                        'lib/Observer-1.0.2.js',
                        'src/dotBox.utility.js',
                        'src/dotBox.utility.line.js',
                        'src/dotBox.utility.iterators.js',
                        'src/dotBox.boxState.js',
                        'src/dotBox.lineState.js',
                        'src/dotBox.gameEngine.js',
                        'src/dotBox.model.js',
                        'src/dotBox.views.constants.js',
                        'src/dotBox.views.viewContext.js',
                        'src/dotBox.views.Color.js',
                        'src/dotBox.views.board.js',
                        'src/dotBox.views.score.js',
                        'src/dotBox.views.gameOver.js',
                        'src/dotBox.ai.utility.js',
                        'src/dotBox.ai.AiPlayer.js',
                        'src/dotBox.ai.AvoidThirdSide.js',
                        'src/dotBox.ai.SingleBoxCloser.js',
                        'src/dotBox.controller.js',
                        'src/dotBox.game.js',
                        'src/dotBox.viewModel.js',
                        'src/dotBox.ko.js',
                        'src/app.js']
                }
            }
        }


    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.registerTask('default', ['uglify:js' ]);


};

