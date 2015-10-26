/**
 * Game Name Space 
 */
var Game = (function(canvas) {

            // Controls the game start
        var started = false,

            // controls setInterval
            intervalId = 0,

            /*
             * Game initialization function. Construct all 
             * game execution elements.
             */
            init = function () {
                // Start the game
                if (!started){

                    window.canvasCtx = canvas.ctx;
                    // Define the canvas bitmap dimensions 
                    canvas.canvas.setAttribute('width', 500);
                    canvas.canvas.setAttribute('height', 250);
                    
                    // Assign the canvas object dimensions to the program
                    WIDTH  = canvas.canvas.width;   
                    HEIGHT = canvas.canvas.height;
                    
                    // Put paddles on the abscissa: 5 px left, -5 px right
                    canvas.player1.x = WIDTH -5;
                    canvas.player2.x = 2;
                    // Put paddles on the ordinate: vertically centralized
                    canvas.player1.y = canvas.player2.y = (HEIGHT /2)-(canvas.paddle_h/2);
                    
                    // Define canvas limits horizontally
                    canvasMinX = canvas.canvas.offsetLeft;
                    canvasMaxX = canvasMinX + WIDTH;
                    
                    // Initial position of the ball
                    canvas.ball.x = WIDTH /2;
                    canvas.ball.y = HEIGHT /2;
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
                
              canvasMinY = canvas.canvas.offsetTop;
              canvasMaxY = canvasMinY + HEIGHT;
            },

            /* Paddles control function */
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

            /* Função de finalização do jogo */
            fimJogo = function(){
                
                started = false;
                clearInterval(intervalId);
            };

            /* Name Space Constructor */
            (function() {
                window.fimJogo = fimJogo; 
            })();

            return {
                init: function () {
                    return init();
                }
            }
});
