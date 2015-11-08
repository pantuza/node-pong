/**
 * Main Script. On document ready state it 
 * calls other scripts to control the game
 */
var Client = (function(){


    var main = function() {

        canvas = Canvas();
        game = new Game(canvas);
        connection = Connection(game);
    };

    return main();

})();
