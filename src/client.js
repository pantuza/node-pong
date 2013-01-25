

var socket;

// Defines which player ('p1', 'p2'). Stores the html element ID
var playerElm;

// Canvas Element Object
var canvasObj;

// Canvas Context
var ctx;

// Controls the game start
var started = false;

/* right blade */
var player1 = {
	x : 0,
	y : 0	
}

/* left blade */
var player2 = {
	x : 0,
	y : 0
}

/* Ball object */
var ball = {
    // Position
	x  : 0,
	y  : 0,
	
	// Displacement
	dx : -8,
	dy : 16,
}


// Canvas Dimensions
var WIDTH; 
var HEIGHT;

// Paddles Dimensions 
var paddle_h = 40;
var paddle_w = 3;

// Limits of mouse moviments
var canvasMinX,
	canvasMaxX,
	canvasMinY,
	canvasMaxY;

// controls setInterval
var intervalId = 0;

/*
 * Game initialization function. Construct all 
 * game execution elements.
 * author: Gustavo Pantuza, Fabrício Bedeschi
 * since: 06.07.2011 
 */
function init() {
	// Start the game
	if (!started){

		canvasObj = document.getElementById('canvas');
		// Get the canvas element 2D context 
		ctx = canvasObj.getContext("2d");
		window.ctx = ctx;
		// Define the canvas bitmap dimensions 
		canvasObj.setAttribute('width', 500);
		canvasObj.setAttribute('height', 250);
		
		// Assign the canvas object dimensions to the program
		WIDTH  = canvasObj.width;   
		HEIGHT = canvasObj.height;
		
		// Put paddles on the abscissa: 5 px left, -5 px right
		player1.x = WIDTH -5;
		player2.x = 2;
		// Put paddles on the ordinate: vertically centralized
		player1.y = player2.y = (HEIGHT /2)-(paddle_h/2);
		
		// Define canvas limits horizontally
		canvasMinX = $("#canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;
		
		// Initial position of the ball
		ball.x = WIDTH /2;
		ball.y = HEIGHT /2;
        //
		// Define mouse moviments limits on the screen
		init_mouse();
		
		// Bind mousemove event to the onMouseMove function
		$(document).mousemove(onMouseMove);
		
		// Create the beforeDraw function interval call
		intervalId = setInterval(beforeDraw, 100);
		
		started = true;
		return intervalId;
	}
}

/*
 * Canvas clear function. It is called on each 
 * algorithm redraw iteration
 * author: Gustavo Pantuza, Fabrício Bedeschi
 * since: 06.07.2011
 */
function clear() {
    canvasObj.setAttribute('height', 250);
    //ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

/*
 * Circles creation function
 *
 * param x, y : Certer of the circle coordinates
 * param r: circle radio
 * return: drawed circle on canvas 
 * 
 * author: Gustavo Pantuza, Fabrício Bedeschi
 * since: 06.07.2011
 */
function circle(x,y,r) {
    ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
}

/*
 * Rectangle creation function
 *
 * param x, y : left upper corner coordinates of the rectangle 
 * param w : Define rectangle width
 * param h : Define rectangle heigh
 * return : drawed rectangle on canvas
 * 
 * author : Gustavo Pantuza, Fabrício Bedeschi
 * since : 06.07.2011
 */
function rect(x,y,w,h) {
    ctx.beginPath();
	ctx.rect(x,y,w,h);
	ctx.closePath();
	ctx.fill();
}

/*
 * Mouse limits moviment function
 * author : Gustavo Pantuza, Fabrício Bedeschi
 * since : 06.07.2011
 */
function init_mouse() {
	
  canvasMinY = $("#canvas").offset().top;
  canvasMaxY = canvasMinY + HEIGHT;
}

/*
 * Função de controle do movimento das paletas. É chamada
 * a cada execução do setInterval
 * author : Gustavo Pantuza, Fabrício Bedeschi
 * since : 06.07.2011
 */
function onMouseMove(evt) {
  if (evt.pageY > canvasMinY && (evt.pageY + paddle_h) < canvasMaxY) {
	  if (playerElm == 'p1')
		  player1.y = parseInt(evt.pageY - canvasMinY);
	  else
		  player2.y = parseInt(evt.pageY - canvasMinY);
  }
}

/*
 * Dispara uma mensagem para o servidor 'nodejs' informando
 * os posicionamentos do players e em seguida executa a 
 * função de desenho do jogo
 * author : Gustavo Pantuza, Fabrício Bedeschi
 * since : 06.07.2011
 */
function beforeDraw() {
	
	if (playerElm == 'p1'){
		msg( {p1 : player1} );
	}else{
		msg( {p2 : player2} );
	}
	
	draw();
}

/*
 * Função que desenha todo o jogo dentro do canvas. A cada
 * execução do 'setInterval' limpa o canvas e redesenha os
 * objetos com suas posições correntes. 
 * 
 * Trata as colisões da bolinha dentro do canvas em relação
 * as abscissas e ordenadas
 * 
 * author: Gustavo Pantuza, Fabrício bedeschi
 * since: 06.07.2011
 */
function draw() {
	// limpa o canvas
	clear();
	// constrói a bolinha
	circle(ball.x, ball.y, 5);
	
	//desenha paddles na tela
	rect(player1.x, player1.y, paddle_w, paddle_h);
	rect(player2.x, player2.y, paddle_w, paddle_h);
	
	// Se a próxima posição da bola for maior que altura ou menor que zero (limites verticais do canvas)
	if (ball.y + ball.dy > HEIGHT || ball.y + ball.dy < 0){
		// inverte seu deslocamento em relação a ordenada (y)
		ball.dy = -ball.dy;
	}
		
	// Se a próxima posição da bola mais a largura da paleta for maior que a largura total
	if (ball.x + ball.dx + paddle_w + 5 > WIDTH) {
		// Se a bola colidiu com a paleta
		if (ball.y > player1.y && ball.y < player1.y + paddle_h)
			// Inverte-se o deslocamento da bolinha em relação a abscissa (x)
			ballcanvasObj= -ball.dx;
		
		else {
			// Fim do jogo (bolinha vazou)
			setTimeout( fimJogo,1000 );
			
	    }
	
	// Se a próxima posição da bola for menor do que a largura da paleta
	}else if (ball.x + ball.dx < paddle_w + 5){
		// Se a bola colidiu com a paleta
		if (ball.y > player2.y && ball.y < player2.y + paddle_h)
			// Inverte-se o deslocamento da bolinha em relação a abscissa (x) 
			ball.dx = -ball.dx;
		else {
			// Fim do jogo (bolinha vazou)
			setTimeout( fimJogo,1000 );
			//alert ('encostou do lado esquerdo');
	    }
	}
	
	// desloca a bolinha nos eixos x e y
	ball.x += ball.dx;
	ball.y += ball.dy;
}

/*
 * Função de conexão com o servidor
 * param p : Id do elemento html do player a se conectar ('p1' ou 'p2')
 * 
 */
function conect (p) {
	
	playerElm = p;
	
	// instâcia um objeto do iosocket passando o endereço do servidor e a porta de conexão
	socket = new io.Socket('192.168.0.101',{
	  port: 1234
	});
	socket.connect();
	
	// Evento sobre a ação de conectar ao servidor
	socket.on('connect',function() {
	  // Mostra uma mensagem ao cliente mostrando a conexão
	  $("#"+playerElm).children('a').text(playerElm+' conectado');
	});
	
	// Add a connect listener
	socket.on('message',function(data) {
		
		// Se for a mensagem de start o jogo será iniciado
		if (data == 'start'){
			// Altera o título acima do canvas
			$("h3").text("Que vença o melhor \\o\\o/o/");
			// chama a função init do Java Script
			init();
		// senão atribui os objetos enviados pelo servidor aos objetos no cliente a serem redesenhados
		}else {
			if (playerElm == 'p1'){
				player2 = data.p2;
			}else{
				player1 = data.p1;
			}
		}
		//ball = data.b;
		
	});
	
	// Evento para desconetar o cliente
	socket.on('disconnect',function() {
	  // Mostra uma mensagem ao cliente que desconectou
	  $("#"+playerElm).children('a').text(playerElm+' desconectado');
	});
	
	// Sends a message to the server via sockets
	return false;
}

/*
 * Função de finalização do jogo
 * author: Gustavo Pantuza
 * since: 09.07.2011
 */
function fimJogo(){
	
	started = false;
	clearInterval(intervalId);
}

/*
 * Função de troca de mensagem com o servidor
 * param mensagem: objetos dos player a serem enviados ao servidor
 * 
 */
function msg(message) {
	  socket.send(message);
}
