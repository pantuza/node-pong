/**
 * Main Script. On document ready state it
 * calls other scripts to control the game
 */
(function(){

    canvas = new Canvas();
    game = new Game(canvas);
    connection = new Connection(game);
})();
