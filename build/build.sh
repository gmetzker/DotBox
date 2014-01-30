#!/bin/bash
java -jar /closure-compiler/compiler.jar --js \
../lib/Observer-1.0.2.js \
../src/dotBox.utility.js \
../src/dotBox.utility.line.js \
../src/dotBox.utility.iterators.js \
../src/dotBox.boxState.js \
../src/dotBox.lineState.js \
../src/dotBox.gameEngine.js \
../src/dotBox.model.js \
../src/dotBox.views.constants.js \
../src/dotBox.views.viewContext.js \
../src/dotBox.views.Color.js \
../src/dotBox.views.board.js \
../src/dotBox.views.score.js \
../src/dotBox.views.gameOver.js \
../src/dotBox.ai.utility.js \
../src/dotBox.ai.AiPlayer.js \
../src/dotBox.ai.AvoidThirdSide.js \
../src/dotBox.ai.SingleBoxCloser.js \
../src/dotBox.controller.js \
../src/dotBox.game.js \
--js_output_file ../lib/dotBox-min.js \
--create_source_map ../lib/dotBox-min.js.map \
--compilation_level SIMPLE_OPTIMIZATIONS \
--source_map_format=V3 \
--output_wrapper "%output% //@ sourceMappingURL=./dotBox-min.js.map"