/**
 * Canvas Name Space
 */
var Canvas = function() {

    var that = this,
    // Canvas Element Object
    _canvasObj,
    // Canvas Context
    _canvasCtx,
    // Canvas Dimensions
    WIDTH,
    HEIGHT,
    // Limits of mouse moviments
    canvasMinX,
    canvasMaxX,
    canvasMinY,
    canvasMaxY;

    /* right blade */
    this.player1 = {
        x : 0,
        y : 0
    },
    /* left blade */
    this.player2 = {
        x : 0,
        y : 0
    },

    DEFAULT_DX = -8,
    DEFAULT_DY = 16,

    /* Ball object */
    this.ball = {
        // Position
        x  : 0,
        y  : 0,

    // Displacement
        dx : DEFAULT_DX,
        dy : DEFAULT_DY,
    },

    // Paddles Dimensions
    this.paddle_h = 40,
    this.paddle_w = 3,

    /*
     * Canvas clear function. It is called on each
     * algorithm redraw iteration
     */
    clear = function() {
        _canvasObj.setAttribute('height', 250);
    },


    /*
     * Circles creation function
     *
     * param x, y : Certer of the circle coordinates
     * param r: circle radio
     * return: drawed circle on canvas
     */
    circle = function(x, y, r) {
        _canvasCtx.beginPath();
        _canvasCtx.arc(x, y, r, 0, Math.PI * 2, true);
        _canvasCtx.closePath();
        _canvasCtx.fill();
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
        _canvasCtx.beginPath();
        _canvasCtx.rect(x,y,w,h);
        _canvasCtx.closePath();
        _canvasCtx.fill();
    },


    /*
     * Defines the canvas bitmap dimensions
     */
    this.setDimensions = function (width, height) {

        if(!width || !height) {
            throw new Error("Missing parameters to set canvas dimensions");
        }

        _canvasObj.setAttribute('width', width);
        _canvasObj.setAttribute('height', height);
    },


    /*
     * Sets positions of the players paddles
     */
    _setPaddles = function () {

        // Put paddles on the abscissa: 5 px left, -5 px right
        that.player1.x = 2;
        that.player2.x = _canvasObj.width -5;
        // Put paddles on the ordinate: vertically centralized
        that.player1.y = that.player2.y = (_canvasObj.height /2)-(that.paddle_h/2);
    },


    /*
     * Define canvas limits horizontally
     */
    _setLimits = function () {
        canvasMinX = _canvasObj.offsetLeft;
        canvasMaxX = canvasMinX + _canvasObj.width;
    }

    /**
     * Sets the ball position at any time
     */
    this.setBallPosition = function (x, y) {

        this.ball.x = x;
        this.ball.y = y;
    },

    /**
     * Sets the ball displacement at any time
     */
    this.setBallDisplacement = function (dx, dy) {

        this.ball.dx = dx;
        this.ball.dy = dy;
    },

    /*
     * Sets the ball start point in the canvas
     */
    _setBallStartPosition = function () {

        that.setBallPosition(_canvasObj.width / 2, _canvasObj.height / 2);
        that.setBallDisplacement(DEFAULT_DX, DEFAULT_DY);
    },


    /*
     * Mouse limits moviment function
     */
    _setMouse = function() {

      canvasMinY = _canvasObj.offsetTop;
      canvasMaxY = canvasMinY + _canvasObj.height;
    },


    /*
     * Paddles control function
     */
    this.onMouseMove = function(evt) {

      if (evt.pageY > canvasMinY && (evt.pageY + that.paddle_h) < canvasMaxY) {

          if (game.playerID == 'p1')
              that.player1.y = parseInt(evt.pageY - canvasMinY);
          else
              that.player2.y = parseInt(evt.pageY - canvasMinY);
      }
    },


    /*
     * Start the game objects on the canvas
     */
    this.startObjectsOnCanvas = function () {

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
    this.draw = function() {
        // clean the canvas
        clear();
        // create the ball
        circle(this.ball.x, this.ball.y, 5);

        //creates the paddles
        rect(this.player1.x, this.player1.y, this.paddle_w, this.paddle_h);
        rect(this.player2.x, this.player2.y, this.paddle_w, this.paddle_h);

        // Inverts the ball displacement if the ball dimensions
        // is greater than the canvas vertical limits
        if (this.ball.y + this.ball.dy > HEIGHT || this.ball.y + this.ball.dy < 0){
            this.ball.dy = -this.ball.dy;
        }

        // ball next position
        var ballNextPos = this.ball.x + this.ball.dx;

        // If the ball is going to pass the game area by right side
        if (ballNextPos + this.paddle_w + 5 > WIDTH) {

            // Inverts the ball displacement on abscissas
            // if the ball collided with the paddle
            if (this.ball.y > this.player1.y && this.ball.y < (this.player1.y + this.paddle_h)) {
                this.ball.dx = -this.ball.dx;

            } else {
                game.score('p1');
            }

        // If the next moviment of the ball is smaller than game area by left
        }else if (ballNextPos < this.paddle_w + 5){

            // Inverts the ball displacement if it collided with the paddle
            if (this.ball.y > this.player2.y && this.ball.y < (this.player2.y + this.paddle_h)) {
                this.ball.dx = -this.ball.dx;

            } else {
                game.score('p2');
            }
        }

        // move the ball
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
    };


    _canvasObj = document.getElementById('canvas');
    WIDTH = _canvasObj.width;
    HEIGHT = _canvasObj.height;


    // Get the canvas element 2D context
    _canvasCtx = _canvasObj.getContext("2d");

    this.obj = _canvasObj;
    this.ctx = _canvasCtx;
}
