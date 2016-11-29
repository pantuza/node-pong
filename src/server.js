/**
 * The Server namespace
 */
var Server = (function(){

    var PORT = 3000,

        START_MSG = "GAME_START",
        CREATE_ROOM = "CREATE_ROOM",
        JOIN_ROOM = "JOIN_ROOM",
        LEAVE_ROOM = "LEAVE_ROOM",
        POSITION = "POSITION",

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

            if (message.hasOwnProperty("type")) {

                switch (message.type) {

                    case START_MSG:
                        if(message.hasOwnProperty("room")) {
                            startGameAtRoom(message);
                        }
                        break;

                    case CREATE_ROOM:
                        if(message.hasOwnProperty("room")) {
                            createRoom(message.room, this);
                        }
                        break;

                    case JOIN_ROOM:
                        if(message.hasOwnProperty("room")) {
                            joinRoom(message.room, this);
                        }
                        break;

                    case POSITION:
                        if(message.hasOwnProperty("position")) {
                            sendPosition(message, this);
                        }
                        break;
                    default:
                        console.error("Unrecognized message: " + message);
                        break;
                }
            }
        },

        /**
         * Starts the game at room sending the start message to all players
         */
        startGameAtRoom = function (message) {

            if(roomHasPlayers(message.room)) {
                sendAll(message);
                console.log("Started game room: " + message.room);
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

            if(responseData.ack) {
                console.log("Created game room: " + room);
            }
            player.send(responseData);
        },

        /**
         * Join an existing room
         */
        joinRoom = function (room, player) {

            var responseData = {
                type: JOIN_ROOM,
                ack: false,
            }

            if(games.hasOwnProperty(room) && knownClient(player)) {

                games[room].player2 = player;
                responseData.ack = true;
                player.nodePongRoom = room;
            }

            if(responseData.ack) {
                console.log("Player " + player.id + " joined room " + room);
            }
            player.send(responseData);
        },

        /**
         * Checks if room has all users to continue a game
         */
        roomHasPlayers = function (room) {

            if(typeof room !== "string") {
                console.error("Wrong type for parameter room. Must be string");
            }

            if(games.hasOwnProperty(room)) {
                if(games[room].player1 && games[room].player2) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Sends positions of one player to another
         */
        sendPosition = function (message, player) {

            var room = this.nodePongRoom;
            if(games.hasOwnProperty(room)) {

                if(roomHasPlayers(room)) {

                    var currentPlayer = games[room].player1;
                    if(games[room].player2 == player) {
                        currentPlayer = games[room].player2;
                    }

                    currentPlayer.send(message);
                }
            }
        },

        /*
         * Broadcast message to all clients
         */
        sendAll = function (msg){

            console.log(
                "Multicasting message: " + msg.type + " to users [" +
                games[msg.room].player1.id + ", " +
                games[msg.room].player2.id + "]"
            );

            games[msg.room].player1.send(msg);
            games[msg.room].player2.send(msg);
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
        },

        /**
         * Remove player from room
         */
        leaveRoom = function (room) {

            if(games.hasOwnProperty(room)) {

                if(games[room].player1 == this) {

                    games[room].player1 = null;
                    if(games[room].player2) {
                        games[room].player2.send({
                            type: LEAVE_ROOM,
                        });
                    }

                } else if(games[room].player2 == this) {

                    games[room].player2 = null;
                    if(games[room].player1) {
                        games[room].player1.send({
                            type: LEAVE_ROOM,
                        });
                    }
                }
            }
        },

        /**
         * Remove player from players list
         */
        removePlayerSocket = function (player) {

            var playerIndex = players.indexOf(player);

            if(playerIndex) {
                console.log("Removing player " + player.id + " socket");
                players.splice(playerIndex, 1);
            } else {
                console.log("Player not found in players list");
            }
        },

        /**
         * Client connection callback
         */
        onConnectionCallback = function (client) {

            if(!knownClient(client)) {

                client.on('message', msgFromPlayer);
                client.on('disconnect', onDisconnect);

                players.push(client);
                console.log("Player " + client.id + " connected");
            }
        },

        /**
         * When user disconnects, it sends a notification
         * author: Gustavo Pantuza
         * since : 09.07.2011
         */
        onDisconnect = function () {

            removePlayerSocket(this);
            console.log("Player " + this.id + " disconnected");
            leaveRoom(this.nodePongRoom);
            console.log("Stopped game room " + this.nodePongRoom);
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
