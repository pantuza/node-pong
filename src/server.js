// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('/usr/local/lib/node_modules/socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 

  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' });
  res.end('<h1>Hello Socket Lover!</h1>');
});

// Define socket port to listen 
server.listen(1234);

// Instantiate socket.io using the created server
var socket = io.listen(server);

var player1;
var player2;

var onConnectionCallback = function (client) {
	
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
}

// Connection event
socket.on('connection', onConnectionCallback); 

/*
 * Player 1 send messages to player 2
 * author : Gustavo Pantuza
 * since	: 09.07.2011
 */
function msgFromPlayer1(msg){
	
	if(msg == "start"){
		sendAll(msg);
		return
	}
	// Send message to player 2
	player2.send(msg);
}
  
/*
 * Player 2 send messages to player 1
 * author : Gustavo Pantuza
 * since	: 09.07.2011
 */
function msgFromPlayer2(msg){

	if (msg == "start"){
		sendAll(msg);
		return
	}
	// Send message to player 1
	player1.send(msg);
}

/*
 * Broadcast message to all clients
 * author: Gustavo Pantuza
 * since: 09.07.2011
 */
function sendAll(msg){
    player1.send(msg);
    player2.send(msg);
}

/*
 * When user disconnects, it sends a notification
 * author: Gustavo Pantuza
 * since : 09.07.2011
 */
function onDisconnect() {
	console.log('Server has disconnected');
}
