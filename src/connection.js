/**
 * Server Connection Name Space
 */
var Connection = function(game) {

    var SERVER_ADDR = '127.0.0.1',

    PORT = 3000,

    // loop index
    i = 0,

    h3 = undefined,

    that = this;

    this.socket = undefined;

    /**
     * Function that send messages to the server
     * param message: data to send to server
     */
    this.msg = function (message) {

          this.socket.send(message, game.playerID);
          console.log(message);
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

        /* Triggers the start event to begin the game */
        if (data === 'start') {

            h3.textContent = "The best player win!";

            var startEvent = new Event('start');
            window.dispatchEvent(startEvent);

        } else if (data.erro) {

            game.writeLog(data.erro);
        } else {
            /* sets the other player positions on canvas */
            if (game.playerID == 'p1') {

                canvas.player2 = data.p2;
            } else {

                canvas.player1 = data.p1;
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


    h3 = document.getElementById('canvas_header');
};
