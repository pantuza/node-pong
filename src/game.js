/**
 * Game Name Space
 */
var Game = function(canvas) {

    // Controls the game start
    var STARTED = false,

    // controls setInterval
    INTERVAL_ID = 0,

    /* Log div */
    logDiv,

    that = this,

    /*
     * Game initialization function. Construct all
     * game execution elements.
     */
    _init = function () {
        // Start the game
        if (!STARTED){

            window.canvasCtx = canvas.ctx;

            logDiv = document.getElementById("log");

            canvas.setDimensions(500, 250);
            canvas.startObjectsOnCanvas();

            // Bind mousemove event to the onMouseMove function
            document.documentElement.onmousemove = canvas.onMouseMove;

            // Create the beforeDraw function interval call
            INTERVAL_ID = setInterval(beforeDraw, 100);
            STARTED = true;

        } else throw new Error("Game already started!");
    },



    /*
     * Function that triggers messages to players and then redraw the canvas
     */
    beforeDraw = function() {

        if (connection.playerElm == 'p1'){
            connection.msg({p1: canvas.player1});
        } else {
            connection.msg({p2: canvas.player2});
        }

        canvas.draw();
    },


    /*
     * Function to end the game
     */
    _endGame = function() {

        if(STARTED) {
            STARTED = false;
            clearInterval(INTERVAL_ID);
            window.alert("End of game");
        }
    };


    window.fimJogo = _endGame;

    window.addEventListener('start', function (event) {
        game.init();
    }, false);

    return {
        init: _init,
        endGame: _endGame
    }
}
