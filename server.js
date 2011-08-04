// Require HTTP module (to start server) and Socket.IO
var http = require('http'), io = require('/usr/local/lib/node_modules/socket.io');

// Start the server at port 8080
var server = http.createServer(function(req, res){ 

  // Send HTML headers and message
  res.writeHead(200,{ 'Content-Type': 'text/html' });
  res.end('<h1>Hello Socket Lover!</h1>');
});

// Define a porta de escuta do socket
server.listen(1234);

// Cria instância de socket.io passando o server criado
var socket = io.listen(server);

// variáveis representando os usuários
var player1;
var player2;

// Evento sobre a conexão
socket.on('connection', function(client){
	
	// Se não existe player 1, atribui o cliente ao player1 
	if( !player1 ){
		
		console.log( "player 1 conectado!" );
		player1 = client;
		// Evento de escuta sobre mensagens enviadas ao server
		player1.on('message', function(event){
			msgFromPlayer1( event );
		});
		// Evento de escuta 'disconnect' do cliente
		player1.on('disconnect', function(){
			onDisconnect();
		});
		
	
	// Se não existe player 2, atribui o cliente ao player2
	}else if( !player2 ){
		
		console.log( "player 2 conectado!" );
		player2 = client;
		// Evento de escuta sobre mensagens enviadas ao server
		player2.on('message', function(event){
			msgFromPlayer2( event );
		});
		// Evento de escuta 'disconnect' do cliente
		player2.on('disconnect', function(){
			onDisconnect();
		});
		
	
	// Senão, excedeu o limite de 2 usuários para o jogo. Um mensagem de notificação  é enviada ao cliente
	}else {
		client.send( {erro:'muitos usuarios'} );
	}
 
});

/*
* Função de envio de mensagens do player 1 para o player 2
* author : Gustavo Pantuza
* since	: 09.07.2011
*/
function msgFromPlayer1(msg){
	
	if(msg == "start"){
		sendAll(msg);
		return
	}
	// Envia mensagem para o player 2
	player2.send( msg );
}
  
/*
* Função de envio de mensagens do player 2 para o player 1
* author : Gustavo Pantuza
* since	: 09.07.2011
*/
function msgFromPlayer2(msg){

	if(msg == "start"){
		sendAll(msg);
		return
	}
	// Envia mensagem para o player 1
	player1.send( msg );
}
/*
 * Função de envio de mensagens do servidor para todos os clientes
 * author: Gustavo Pantuza
 * since: 09.07.2011
 */
function sendAll( msg ){
	player1.send( msg );
	player2.send( msg );
}
  
/*
* Função de notificação quando o usuário desconectar
* author: Gustavo Pantuza
* since : 09.07.2011
*/
function onDisconnect(){
	console.log('Server has disconnected');
}
