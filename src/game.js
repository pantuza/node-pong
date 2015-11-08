/**
 * Game Name Space 
 */
var Game = function(canvas) {

    // Controls the game start
    var STARTED = false,

    // controls setInterval
    INTERVAL_ID = 0,

    /*
     * Game initialization function. Construct all 
     * game execution elements.
     */
    _init = function () {
        // Start the game
        if (!STARTED){

            window.canvasCtx = canvas.ctx;

            canvas.setDimensions(500, 250);
            setGamePaddles();
            
            // Define canvas limits horizontally
            // canvasMinX = canvas.obj.offsetLeft;
            // canvasMaxX = canvasMinX + canvas.obj.width;
            
            setBallStartPosition();
            init_mouse();
            
            // Bind mousemove event to the onMouseMove function
            document.documentElement.onmousemove = onMouseMove;
            
            // Create the beforeDraw function interval call
            INTERVAL_ID = setInterval(beforeDraw, 100);
            STARTED = true;

        } else throw new Error("Game already started!");
    },



    /* 
     * Sets positions of the players paddles 
     */
    setGamePaddles = function () {
    
        // Put paddles on the abscissa: 5 px left, -5 px right
        canvas.player1.x = canvas.obj.width -5;
        canvas.player2.x = 2;
        // Put paddles on the ordinate: vertically centralized
        canvas.player1.y = canvas.player2.y = (canvas.obj.height /2)-(canvas.paddle_h/2);
    },


    /* 
     * Sets the ball start point in the canvas
     */
    setBallStartPosition = function () {
    
        canvas.ball.x = canvas.obj.width /2;
        canvas.ball.y = canvas.obj.height /2;
    },


    /* 
     * Mouse limits moviment function 
     */
    init_mouse = function() {
        
      canvasMinY = canvas.obj.offsetTop;
      canvasMaxY = canvasMinY + canvas.obj.height;
    },


    /* 
     * Paddles control function 
     */
    onMouseMove = function(evt) {

      if (evt.pageY > canvasMinY && (evt.pageY + canvas.paddle_h) < canvasMaxY) {
      
          if (playerElm == 'p1')
              canvas.player1.y = parseInt(evt.pageY - canvasMinY);
          else
              canvas.player2.y = parseInt(evt.pageY - canvasMinY);
      }
    },


    /*
     * Function that triggers messages to players and then redraw the canvas
     */
    beforeDraw = function() {
        
        if (playerElm == 'p1'){
            msg({p1: canvas.player1});
        } else {
            msg({p2: canvas.player2});
        }
        
        canvas.draw();
    },


    /* 
     * Function to end the game
     */
    _endGame = function() {
        
        STARTED = false;
        clearInterval(INTERVAL_ID);
        window.alert("End of game");
    };


    window.fimJogo = _endGame; 

    return {
        init: _init,
        endGame: _endGame
    }
}
