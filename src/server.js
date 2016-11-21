/**
 * The Server namespace
 */
var Server = (function(){

    var PORT = 3000,

        START_MSG = "start",

        express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),

        server = undefined,
        socket = undefined,
        player1 = undefined,
        player2 = undefined,

        /**
         * Connection server answer
         */
        serverAnswer = function(req, res) {

            // Send HTML headers and message
            res.header("Access-Control-Allow-Origin", "*")
            res.sendFile(__dirname + '/index.html');
        },


        /**
         * Callback of messages sent by players
         */
        msgFromPlayer = function(message, player) {

            /* Send start message for all players */
            if (message == START_MSG) {
                sendAll(message);
                return;

            } else if (player == player1.id) {
                player2.send(message);
            } else {
                player1.send(message);
            }
        },


        /*
         * Broadcast message to all clients
         */
        sendAll = function (msg){
            player1.send(msg);
            player2.send(msg);
        },

        /**
         * Client connection callback
         */
        onConnectionCallback = function (client) {

            // If not exists a player 1, create it
            if (!player1) {

                player1 = client;
                player1.nodePongID = 1;
                player1.on('message', msgFromPlayer);
                player1.on('disconnect', onDisconnect);
                console.log("player 1 connected");

            // If not exists player 2, create it
            } else if (!player2) {

                player2 = client;
                player2.nodePongID = 2;
                player2.on('message', msgFromPlayer);
                player2.on('disconnect', onDisconnect);
                console.log( "player 2 connected");

            // Otherwise, notify client that there are too many user to play
            } else {
                client.send({erro:'Too many Users :/'});
            }
        },

        /*
         * When user disconnects, it sends a notification
         * author: Gustavo Pantuza
         * since : 09.07.2011
         */
        onDisconnect = function () {
            console.log("Player " + this.nodePongID + " disconnected");

            if(this.nodePongID === 1) {
                player1 = null;
            } else {
                player2 = null;
            }
        };

        /**
         * Initialization method. Bind the server and socket events
         */
        (function() {

            // Start the server
            //server = http.createServer(serverAnswer);
            app.get("/", serverAnswer);
            app.use(express.static(__dirname + "/"));

            //server.listen(PORT); // Define socket port to listen
            http.listen(PORT, function () {
                console.log([
                    "Node-Pong listening on port ", PORT,
                    "\nOpen two different tabs or browsers at ",
                    "localhost:", PORT, " and connect players",
                    "\n\nEnjoy the game : )"
                ].join(""));
            });

            // Instantiate socket.io using the created server
            //socket = io.listen(http);
            io.on('connection', onConnectionCallback);

        })();


        /* NameSpace Public Methods */
        return {
            server: http
        }
})();
