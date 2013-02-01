
/**
 * Server Connection Name Space
 */
var Connection = (function(playerElm) {

    var SERVER_ADDR = '192.168.0.101',
        PORT = 1234,
        
        socket,

        /*
         * Função de troca de mensagem com o servidor
         * param mensagem: objetos dos player a serem enviados ao servidor
         */
        msg = function (message) {
              socket.send(message);
        },


        onConnectCallback = function() {
            // Mostra uma mensagem ao cliente mostrando a conexão
            playerElm.childNodes[0].textContent = element + ' connected';
        },

        onMessageCallback = function(data) {
                
            // Se for a mensagem de start o jogo será iniciado
            if (data == 'start'){
                // Altera o título acima do canvas
                h3.textContent = "The best player win!";
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
        },

        onDisconnectCallback = function() {
              // Mostra uma mensagem ao cliente que desconectou
                playerElm.childNodes[0].textContent = element + ' disconnected'; 
        },

        /*
         * Função de conexão com o servidor
         * param element : Id do elemento html do player a se conectar ('p1' ou 'p2')
         */
        connect = function(element) {
            
            playerElm = document.getElementById(element);
            
            // instâcia um objeto do iosocket passando o endereço do servidor e a porta de conexão
            socket = new io.Socket(SERVER_ADDR, { port: PORT });
            socket.connect();
            
            socket.on('connect', onConnectCallback);
            socket.on('message', onMessageCallback);
            socket.on('disconnect', onDisconnectCallback);
            
            return false;
        };

    /* Name Space Public methods and attributes */
    return {
        connect: function(elm) {
            return connect(elm);
        },

        socket: socket
    }

});
