/**
 * Game Name Space
 */
var Game = function(canvas) {

    // Controls the game start
    var STARTED = false,

    // controls setInterval
    INTERVAL_ID = 0,

    /* Number of points to win the game */
    MATCH_POINTS = 10,

    /* Log div */
    logDiv,
    that = this,

    scoreBoard,

    scores = {
        p1: {
            board: document.getElementById("p1-score"),
            points: 0
        },
        p2: {
            board: document.getElementById("p2-score"),
            points: 0
        }
    },

    /* Variable that identifies the current game */
    gameHash;

    this.playerID;


    /*
     * Game initialization function. Construct all
     * game execution elements.
     */
    this.init = function () {
        // Start the game
        if (!STARTED){

            window.canvasCtx = canvas.ctx;

            canvas.setDimensions(500, 250);
            canvas.startObjectsOnCanvas();

            // Bind mousemove event to the onMouseMove function
            document.documentElement.onmousemove = canvas.onMouseMove;
            scoreBoard.style.display = "block";

            // Create the beforeDraw function interval call
            INTERVAL_ID = setInterval(beforeDraw, 100);
            STARTED = true;
            that.writeLog("Game started");

        } else throw new Error("Game already started!");
    },



    /*
     * Function that triggers messages to players and then redraw the canvas
     */
    beforeDraw = function() {

        if (that.playerID == 'p1'){
            connection.msg({p1: canvas.player1});
        } else {
            connection.msg({p2: canvas.player2});
        }

        canvas.draw();
    },


    /**
     * Writes log message on log div
     */
    this.writeLog = function (message) {

        var content = document.createTextNode(message);
        var lineBreak = document.createElement("br");

        logDiv.appendChild(content);
        logDiv.appendChild(lineBreak);
    }

    /**
     * Restarts the game
     */
    this.restart = function () {

        clearInterval(INTERVAL_ID);
        canvas.startObjectsOnCanvas();
        setTimeout(function () {
            INTERVAL_ID = setInterval(beforeDraw, 100);
        }, 3000);
    };

    /**
     * Score points for a player
     */
    this.score = function (player) {

        if (player == "p1") {
            scores.p1.points++;
            scores.p1.board.textContent = scores.p1.points;
        } else {
            scores.p2.points++;
            scores.p2.board.textContent = scores.p2.points;
        }

        if(isThereAWinner()) {
            this.endGame();
        } else {
            this.restart();
        }
    };


    /**
     * Checks if there is a Winner
     */
    isThereAWinner = function () {

        if(scores.p1.points >= MATCH_POINTS) {

            this.writeLog("Player 1 won the game!");
            return true;
        } else if(scores.p2.points >= MATCH_POINTS) {

            this.writeLog("Player 2 won the game!");
            return true;
        }

        return false;
    };

    /*
     * Function to end the game
     */
    this.endGame = function() {

        if(STARTED) {
            STARTED = false;
            clearInterval(INTERVAL_ID);

            that.writeLog("End of the game");
            connection.socket.disconnect();
        }
    };


    /**
     * Creates a hash for a game identification. It gets a random number,
     * converts it to a 36 radix string and returns its last 7 characters as
     * this example: 2fz06wghkt9
     */
    createAGameHash = function () {

        return Math.random().toString(36).substring(7);
    };

    /**
     * Prints the hash to invite a friend to enter the game
     */
    this.invite = function () {

        that.writeLog("Invite player to join using game Hash: " + gameHash);

        createButton.style.display = "none";
        joinButton.style.display = "none";
        startButton.style.display = "block";

    };

    /**
     * Cancels room creation
     */
    this.cancelRoom = function () {

        game.writeLog("We could not create the room. Disconnecting..");
        connection.disconnect();
    };

    /**
     * Connect button callback
     */
    connectOnServerCallback = function (event) {

        that.playerID = 'p1';
        connection.connect();

        connectButton.style.display = "none";
        createButton.style.display = "block";
        joinButton.style.display = "block";

        event.preventDefault();
        event.stopPropagation();
    };

    /**
     * Callback for creating a new game
     */
    createGameCallback = function (event) {

        gameHash = createAGameHash();
        connection.msg({
            type: "CREATE_ROOM",
            room: gameHash,
        });

        event.preventDefault();
        event.stopPropagation();
    };


    /**
     * Callback for joining an existing game
     */
    joinGameCallback = function (event) {

        that.playerID = 'p2';
        joinButton.style.display = "none";
        createButton.style.display = "none";
        joinInput.style.display = "block";
        joinInput.addEventListener("keyup", function (event) {
            connection.connect();
        });

        if(gameHash) {
            startButton.style.display = "block";
            that.writeLog("Players ready");
            that.writeLog("Start the game!");
        }

        event.preventDefault();
        event.stopPropagation();
    };


    /**
     * Callback for starting the game
     */
    startGameCallback = function (event) {

        connection.msg('start');

        event.preventDefault();
        event.stopPropagation();
    };


    connectButton = document.getElementById("connect");
    logDiv = document.getElementById("log"),
    createButton = document.getElementById('create'),
    joinButton = document.getElementById('join'),
    joinInput = document.getElementById("join-input"),
    startButton = document.getElementById('start'),
    scoreBoard = document.getElementById("scoreboard");

    connectButton.addEventListener('click', connectOnServerCallback, false);
    createButton.addEventListener('click', createGameCallback, false);
    joinButton.addEventListener('click', joinGameCallback, false);
    startButton.addEventListener('click', startGameCallback, false);

    window.addEventListener('start', this.init, false);
}
