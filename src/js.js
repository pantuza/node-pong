
// Representa o socket de conexão com o servidor
var socket;

// guarda o id do elemento html para definir player ('p1', 'p2')
var player;

// objeto canvas
var canvasObj;

// Controle se o jogo foi iniciado
var started = false;

/* paleta da direita */
var player1 = {
	x : 0,
	y : 0	
}

/* paleta da esquerda */
var player2 = {
	x : 0,
	y : 0
}

/* Define o objeto que representa a bolinha */
var ball = {
	// definições de posição inicial
	x  : 0,
	y  : 0,
	
	// definições da velocidade da bolinha (deslocamento a cada iteração)
	dx : -8,
	dy : 16,
}

// Contexto do elemento Canvas
var ctx;

// Largura e altura do elemento canvas
var WIDTH; 
var HEIGHT;

//Largura e Altura das paletas (paddles)
var paddle_h = 40;
var paddle_w = 3;

// limites de movimento do mouse
var canvasMinX,
	canvasMaxX,
	canvasMinY,
	canvasMaxY;

// Identificador de controle para o setInterval
var intervalId = 0;

/*
 * Função de inicialização do jogo. Constrói todos
 * os elementos necessários para a execução do jogo.
 * author: Gustavo Pantuza, Fabrício Bedeschi
 * since: 06.07.2011 
 */
function init() {
	
	// Se o jogo já começou, não faz nada e sai da função 'init'
	if (started){
		return;
	// Caso contrário inicia o jogo
	}else {
		// Define que o jogo está em execução
		started = true;
		
		canvasObj = document.getElementById('canvas');
		
		// Busca o contexto do elemento canvas a ser trabalhado
		ctx = canvasObj.getContext("2d");
		window.ctx = ctx;
		// seta as dimensões do bitmap do canvas
		canvasObj.setAttribute('width', 500);
		canvasObj.setAttribute('height', 250);
		
		// Atribui as dimensões do objeto canvas de largura e altura
		WIDTH  = canvasObj.width;
		HEIGHT = canvasObj.height;
		
		//Posicionamento dos paddles sobre a abscissa: 5 px esquerta, -5 direita
		player1.x = WIDTH -5;
		player2.x = 2;
		// Posicionamento dos paddles sobre a ordenada: centralizado verticalmente
		player1.y = player2.y = (HEIGHT /2)-(paddle_h/2);
		
		// Define os limites do canvas horizontalmente
		canvasMinX = $("#canvas").offset().left;
		canvasMaxX = canvasMinX + WIDTH;
		
		// Posicao inicial da bolinha
		ball.x = WIDTH /2;
		ball.y = HEIGHT /2;
		alert("to aqui ");
		// Chama a função que trata os eventos sobre o mouse
		init_mouse();
		
		// executa a função 'onMouseMove' a cada chamada do navegador ao evento 'mousemove'
		$(document).mousemove(onMouseMove);
		
		// Cria o intervalo de execução da função 'beforeDraw' em 150 milisegundos
		intervalId = setInterval(beforeDraw, 100);
		
		return intervalId;
	}
}

/*
 * Função de limpeza do canvas. É executada a cada 
 * iteração do algoritmo que redesenha o jogo.
 * author: Gustavo Pantuza, Fabrício Bedeschi
 * since: 06.07.2011
 */
function clear() {
  canvasObj.setAttribute('height', 250);
  //ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

/*
 * Função de criação de círculos
 * param x, y : São as coordenadas do centro do círculo
 * param r: raio da circunferência
 * return: Desenha o círculo no canvas
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
 * Função de criação de retângulos
 * param x, y : Coordenadas do canto superior à esquerda do retângulo
 * param w : Define a largura do retângulo
 * param h : Define a altura do retângulo
 * return : Desenha o retângulo no canvas
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
 * Função para definir os limites de movimento do mouse
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
	  if (player == 'p1')
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
	
	if (player == 'p1'){
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
	
	player = p;
	
	// instâcia um objeto do iosocket passando o endereço do servidor e a porta de conexão
	socket = new io.Socket('192.168.0.101',{
	  port: 1234
	});
	socket.connect();
	
	// Evento sobre a ação de conectar ao servidor
	socket.on('connect',function() {
	  // Mostra uma mensagem ao cliente mostrando a conexão
	  $("#"+player).children('a').text(player+' conectado');
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
			if (player == 'p1'){
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
	  $("#"+player).children('a').text(player+' desconectado');
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
