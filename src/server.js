/**
 * The Server namespace
 */
var Server = (function(){

    var SOCKET_IO_PATH = '/usr/local/lib/node_modules/socket.io',
        PORT = 1234,

        http = require('http'), 
        io = require(SOCKET_IO_PATH),

        server = undefined,
        socket = undefined,
        player1 = undefined,
        player2 = undefined,

        /**
         * Connection server answer
         */
        serverAnswer = function(req, res) {

            // Send HTML headers and message
            res.writeHead(200,{ 'Content-Type': 'text/html' });
            res.end('<h1>Hello Socket Lover!</h1>');
        },

        /*
         * Player 1 send messages to player 2
         */
        msgFromPlayer1 = function (msg){
            
            if(msg == "start"){
                sendAll(msg);
                return
            }
            // Send message to player 2
            player2.send(msg);
        },
          
        /*
         * Player 2 send messages to player 1
         */
        msgFromPlayer2 = function (msg){

            if (msg == "start"){
                sendAll(msg);
                return
            }
            // Send message to player 1
            player1.send(msg);
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
                player1.on('message', msgFromPlayer1);
                player1.on('disconnect', onDisconnect);
                console.log("player 1 Connected");

            // If not exists player 2, create it
            } else if (!player2) {
                
                player2 = client;
                player2.on('message', msgFromPlayer2);
                player2.on('disconnect', onDisconnect);
                console.log( "player 2 conectado!" );

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
            console.log('Server has disconnected');
        },

        /**
         * Initialization method. Bind the server and socket events
         */
        init = function() {

            // Start the server at port 8080
            server = http.createServer(serverAnswer);
            server.listen(PORT); // Define socket port to listen 

            // Instantiate socket.io using the created server
            socket = io.listen(server);
            socket.on('connection', onConnectionCallback);
        };


        /* NameSpace Public Methods */
        return {
            start: function() {
                return init();
            },

            server: server
        }
})()
