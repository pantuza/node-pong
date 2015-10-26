/**
 * Main Script. On document ready state it 
 * call other scripts to control the game
 */
var Client = (function(){


    var main = function() {

        canvas = Canvas();
        game = Game(canvas);
        connection = Connection(game);
    };

    return main();

})();
