/**
 * Canvas Name Space
 */
var Canvas = function() {

    // Canvas Element Object
    var canvasObj,
    // Canvas Context
    canvasCtx,
    // Canvas Dimensions
    WIDTH,
    HEIGHT,
    // Limits of mouse moviments
    canvasMinX,
    canvasMaxX,
    canvasMinY,
    canvasMaxY,

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

    // Paddles Dimensions 
    paddle_h = 40,
    paddle_w = 3,

    /*
     * Canvas clear function. It is called on each 
     * algorithm redraw iteration
     */
    clear = function() {
        canvasObj.setAttribute('height', 250);
    },


    /*
     * Circles creation function
     *
     * param x, y : Certer of the circle coordinates
     * param r: circle radio
     * return: drawed circle on canvas 
     */
    circle = function(x, y, r) {
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, r, 0, Math.PI*2, true);
        canvasCtx.closePath();
        canvasCtx.fill();
    },


    /*
     * Rectangle creation function
     *
     * param x, y : left upper corner coordinates of the rectangle 
     * param w : Define rectangle width
     * param h : Define rectangle heigh
     * return : drawed rectangle on canvas
     */
    rect = function(x, y, w, h) {
        canvasCtx.beginPath();
        canvasCtx.rect(x,y,w,h);
        canvasCtx.closePath();
        canvasCtx.fill();
    },


    /* 
     * Defines the canvas bitmap dimensions 
     */
    _setDimensions = function (width, height) {

        if(!width || !height) {
            throw new Error("Missing parameters to set canvas dimensions");
        } 

        canvas.obj.setAttribute('width', width);
        canvas.obj.setAttribute('height', height);
    },


    /* 
     * Sets positions of the players paddles 
     */
    _setPaddles = function () {
    
        // Put paddles on the abscissa: 5 px left, -5 px right
        player1.x = canvasObj.width -5;
        player2.x = 2;
        // Put paddles on the ordinate: vertically centralized
        player1.y = player2.y = (canvasObj.height /2)-(paddle_h/2);
    },


    /*
     * Define canvas limits horizontally
     */
    _setLimits = function () {
        canvasMinX = canvasObj.offsetLeft;
        canvasMaxX = canvasMinX + canvasObj.width;
    }


    /* 
     * Sets the ball start point in the canvas
     */
    _setBallStartPosition = function () {
    
        ball.x = canvasObj.width / 2;
        ball.y = canvasObj.height / 2;
    },


    /* 
     * Mouse limits moviment function 
     */
    _setMouse = function() {
        
      canvasMinY = canvasObj.offsetTop;
      canvasMaxY = canvasMinY + canvasObj.height;
    },


    /* 
     * Paddles control function 
     */
    _onMouseMove = function(evt) {

      if (evt.pageY > canvasMinY && (evt.pageY + canvas.paddle_h) < canvasMaxY) {
      
          if (playerElm == 'p1')
              canvas.player1.y = parseInt(evt.pageY - canvasMinY);
          else
              canvas.player2.y = parseInt(evt.pageY - canvasMinY);
      }
    },


    /*
     * Start the game objects on the canvas 
     */
    _startObjectsOnCanvas = function () {

        _setPaddles();
        _setLimits(); 
        _setBallStartPosition();
        _setMouse();
    },


    /*
     * Draw entire game on canvas. For each interval execution
     * clean the canvas and redraw objects with its current positions
     * 
     * Controls the collisions of the ball inside the canvas based in 
     * the abscissas and ordinates 
     */
    _draw = function() {
        // clean the canvas
        clear();
        // create the ball
        circle(ball.x, ball.y, 5);
        
        //creates the paddles
        rect(player1.x, player1.y, paddle_w, paddle_h);
        rect(player2.x, player2.y, paddle_w, paddle_h);
        
        // Inverts the ball displacement if the ball dimensions 
        // is greater than the canvas vertical limits
        if (ball.y + ball.dy > HEIGHT || ball.y + ball.dy < 0){
            ball.dy = -ball.dy;
        }
            
        // If the ball is going to pass the game area 
        if (ball.x + ball.dx + paddle_w + 5 > WIDTH) {
            
            // Inverts the ball displacement on abscissas
            // if the ball collided with the paddle
            if (ball.y > player1.y && ball.y < player1.y + paddle_h) {
                ballcanvasObj= -ball.dx;
            
            } else {
                // End of the game
                setTimeout(fimJogo,1000);
            }
        
        // If the next moviment of the ball is smaller than the paddle
        }else if (ball.x + ball.dx < paddle_w + 5){

            // Inverts the ball displacement if it collided with the paddle
            if (ball.y > player2.y && ball.y < player2.y + paddle_h) {
                ball.dx = -ball.dx;
            } else {
                // End of the game
                setTimeout(fimJogo,1000);
            }
        }
        
        // move the ball
        ball.x += ball.dx;
        ball.y += ball.dy;
    };


    canvasObj = document.getElementById('canvas');
    // Get the canvas element 2D context 
    canvasCtx = canvasObj.getContext("2d");

    /* Name Space Public Methods */
    return {
        obj: canvasObj,
        ctx: canvasCtx,
        player1: player1,
        player2: player2,
        ball: ball,
        paddle_h: paddle_h,
        paddle_w: paddle_w,

        setDimensions: _setDimensions,
        startObjectsOnCanvas: _startObjectsOnCanvas,
        onMouseMove: _onMouseMove,
        draw: _draw 
    }
}
