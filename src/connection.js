/**
 * Server Connection Name Space
 */
var Connection = function(game) {

    var SERVER_ADDR = '127.0.0.1',

    PORT = 3000,

    that = this;

    this.socket = undefined;

    /**
     * Function that send messages to the server
     * param message: data to send to server
     */
    this.msg = function (message) {

          this.socket.send(message, game.playerID);
    },


    /**
     * Callback for client connection on server
     */
    onConnectCallback = function() {

        game.writeLog("Player " + game.playerID + " connected");
    },


    /*
     * When server sends a message this function is called
     */
    onMessageCallback = function(data) {

        if (data.hasOwnProperty("type")) {

            switch (data.type) {

                case "GAME_START":
                    var startEvent = new Event('start');
                    window.dispatchEvent(startEvent);
                    break;

                case "ERROR":
                    game.writeLog(data.error);

                case "GAME_STOP":
                    var stopEvent = new Event('stop');
                    window.dispatchEvent(stopEvent);
                    break;

                case "CREATE_ROOM":
                    if(data.hasOwnProperty("ack")) {
                        if(data.ack) {
                            game.invite();
                        } else if(!data.ack) {
                            game.cancelRoom();
                        }
                    } else {
                        throw Exception("Malformed message from server!");
                    }
                    break;

                case "JOIN_ROOM":
                    if(data.hasOwnProperty("ack")) {
                        if(data.ack) {
                            game.waitForStart();
                        } else if(!data.ack) {
                            game.cannotjoinRoom();
                        }
                    } else {
                        throw Exception("Malformed message from server!");
                    }
                    break;

                case "LEAVE_ROOM":
                    game.playerExitedTheGame();
                    break;

                case "SCORE":
                    game.updateScoreBoard(data);
                    break;

                case "POSITION":
                    /* sets players positions on canvas */
                    if(game.playerID == "p1") {
                        canvas.player2 = data.position;
                    } else {
                        canvas.player1 = data.position;
                    }

                    var x = parseInt((data.ball.x + canvas.ball.x) / 2, 10);
                    var y = parseInt((data.ball.y + canvas.ball.y) / 2, 10);
                    canvas.setBallPosition(x, y);
                    break;
                default:
                    game.writeLog(data);
                    break;
            }
        }
    },


    /*
     * When client disconnect this function is called and shows a 
     * message to the user that disconnected
     */
    onDisconnectCallback = function() {

        game.writeLog("Player " + game.playerID + " disconnected");
    },


    /**
     * Function that connects to the server
     * param element: html element id to be connected ('p1' or 'p2')
     */
    this.connect = function() {

        /* Creates an IO Socket with the server address binding on PORT */
        that.socket = new io(SERVER_ADDR + ":" + PORT);

        that.socket.on('connect', onConnectCallback);
        that.socket.on('message', onMessageCallback);
        that.socket.on('disconnect', onDisconnectCallback);

        that.socket.connect();
    };

    /**
     * Function to disconnect player from server
     */
    this.disconnect = function () {

        that.socket.disconnect();
    };

};
