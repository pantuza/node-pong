/**
 * The Server namespace
 */
var Server = (function(){

    var PORT = 3000,

        START_MSG = "start",
        CREATE_ROOM = "CREATE_ROOM",

        express = require('express'),
        app = express(),
        http = require('http').Server(app),
        io = require('socket.io')(http),

        server = undefined,
        socket = undefined,

        player1 = undefined,
        player2 = undefined,

        /* keep all connected players */
        players = [],

        /* Keep all running games */
        games = {},

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

            }else if(message.hasOwnProperty("type") && message.type == CREATE_ROOM) {

                if(message.hasOwnProperty("room")) {
                    createRoom(message.room, this);
                }

            } else if (player == player1.id) {
                player2.send(message);

            } else {
                player1.send(message);
            }
        },

        /**
         * Create a new game room
         */
        createRoom = function (room, player) {

            var responseData = {
                type: CREATE_ROOM,
                ack: false,
            };

            if(!games.hasOwnProperty(room) && knownClient(player)) {
                games[room] = {
                    player1: player,
                    player2: null,
                };

                responseData.ack = true;
                player.nodePongRoom = room;
            }

            player.send(responseData);
        }

        /*
         * Broadcast message to all clients
         */
        sendAll = function (msg){
            player1.send(msg);
            player2.send(msg);
        },

        /**
         * Checks if the client is already in the players list
         */
        knownClient = function (client) {

            for(var i=0; i < players.length; i++) {

                if(players[i].id === client.id) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Client connection callback
         */
        onConnectionCallback = function (client) {


            if(!knownClient(client)) {

                client.on('message', msgFromPlayer);
                client.on('disconnect', onDisconnect);

                players.push(client);
                console.log("player " + client.id + " connected");
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
