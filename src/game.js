/**
 * Game Name Space 
 */
var Game = (function(canvas){

        var h3 = document.getElementsByTagName("h3")[0],

            // Controls the game start
            started = false,

            // Defines which player ('p1', 'p2'). Stores the html element ID
            playerElm,

            /* right blade */
            player1 = {
                x : 0,
                y : 0
            },
            /* left blade */
            player2 = {
                x : 0,
                y : 0
            },

            /* Ball object */
            ball = {
                // Position
                x  : 0,
                y  : 0,
            
                // Displacement
                dx : -8,
                dy : 16,
            },


            // controls setInterval
            intervalId = 0,

            /*
             * Game initialization function. Construct all 
             * game execution elements.
             */
            init = function () {
                // Start the game
                if (!started){

                    canvasObj = document.getElementById('canvas');
                    // Get the canvas element 2D context 
                    canvasCtx = canvasObj.getContext("2d");
                    window.canvasCtx = canvasCtx;
                    // Define the canvas bitmap dimensions 
                    canvasObj.setAttribute('width', 500);
                    canvasObj.setAttribute('height', 250);
                    
                    // Assign the canvas object dimensions to the program
                    WIDTH  = canvasObj.width;   
                    HEIGHT = canvasObj.height;
                    
                    // Put paddles on the abscissa: 5 px left, -5 px right
                    player1.x = WIDTH -5;
                    player2.x = 2;
                    // Put paddles on the ordinate: vertically centralized
                    player1.y = player2.y = (HEIGHT /2)-(paddle_h/2);
                    
                    // Define canvas limits horizontally
                    canvasMinX = canvasObj.offsetLeft;
                    canvasMaxX = canvasMinX + WIDTH;
                    
                    // Initial position of the ball
                    ball.x = WIDTH /2;
                    ball.y = HEIGHT /2;
                    //
                    // Define mouse moviments limits on the screen
                    init_mouse();
                    
                    // Bind mousemove event to the onMouseMove function
                    document.documentElement.onmousemove = onMouseMove;
                    
                    // Create the beforeDraw function interval call
                    intervalId = setInterval(beforeDraw, 100);
                    
                    started = true;
                    return intervalId;
                }
                return false;
            },

            /* Mouse limits moviment function */
            init_mouse = function() {
                
              canvasMinY = canvasObj.offsetTop;
              canvasMaxY = canvasMinY + HEIGHT;
            },

            /* Paddles control function */
            onMouseMove = function(evt) {

              if (evt.pageY > canvasMinY && (evt.pageY + paddle_h) < canvasMaxY) {
              
                  if (playerElm == 'p1')
                      player1.y = parseInt(evt.pageY - canvasMinY);
                  else
                      player2.y = parseInt(evt.pageY - canvasMinY);
              }
            },

            /*
             * Dispara uma mensagem para o servidor 'nodejs' informando
             * os posicionamentos do players e em seguida executa a 
             * função de desenho do jogo
             */
            beforeDraw = function() {
                
                if (playerElm == 'p1'){
                    msg( {p1 : player1} );
                }else{
                    msg( {p2 : player2} );
                }
                
                draw();
            },

            /* Função de finalização do jogo */
            fimJogo = function(){
                
                started = false;
                clearInterval(intervalId);
            };
});
