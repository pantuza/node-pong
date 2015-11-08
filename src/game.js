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

            setCanvasDimensions();
            setGamePaddles();
            
            // Define canvas limits horizontally
            // canvasMinX = canvas.canvas.offsetLeft;
            // canvasMaxX = canvasMinX + canvas.canvas.width;
            
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
     * Defines the canvas bitmap dimensions 
     */
    setCanvasDimensions = function () {

        canvas.canvas.setAttribute('width', 500);
        canvas.canvas.setAttribute('height', 250);
    },


    /* 
     * Sets positions of the players paddles 
     */
    setGamePaddles = function () {
    
        // Put paddles on the abscissa: 5 px left, -5 px right
        canvas.player1.x = canvas.canvas.width -5;
        canvas.player2.x = 2;
        // Put paddles on the ordinate: vertically centralized
        canvas.player1.y = canvas.player2.y = (canvas.canvas.height /2)-(canvas.paddle_h/2);
    },


    /* 
     * Sets the ball start point in the canvas
     */
    setBallStartPosition = function () {
    
        canvas.ball.x = canvas.canvas.width /2;
        canvas.ball.y = canvas.canvas.height /2;
    },


    /* 
     * Mouse limits moviment function 
     */
    init_mouse = function() {
        
      canvasMinY = canvas.canvas.offsetTop;
      canvasMaxY = canvasMinY + canvas.canvas.height;
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
     * Dispara uma mensagem para o servidor 'nodejs' informando
     * os posicionamentos do players e em seguida executa a 
     * função de desenho do jogo
     */
    beforeDraw = function() {
        
        if (playerElm == 'p1'){
            msg( {p1 : canvas.player1} );
        }else{
            msg( {p2 : canvas.player2} );
        }
        
        canvas.draw();
    },


    /* 
     * Função de finalização do jogo 
     */
    fimJogo = function(){
        
        STARTED = false;
        clearInterval(INTERVAL_ID);
        window.alert("End of game");
    };


    /* Name Space Constructor */
    (function() {
        window.fimJogo = fimJogo; 
    })();


    return {
        init: _init,
        endGame: _endGame
    }
}
