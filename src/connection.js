/**
 * Server Connection Name Space
 */
var Connection = (function() {

    var SERVER_ADDR = '127.0.0.1',
        PORT = 1234,
        
        socket,

        // Defines which player ('p1', 'p2'). Stores the html element ID
        playerElm,

        /*
         * Function that send messages to the server
         * param message: data to send to server
         */
        msg = function (message) {
              socket.send(message);
        },

        onConnectCallback = function() {
            playerElm.childNodes[0].textContent = element + ' connected';
        },

        onMessageCallback = function(data) {
                
            if (data == 'start'){
                h3.textContent = "The best player win!";
                init();

            }else {
                // create users 
                if (playerElm == 'p1'){
                    canvas.player2 = data.p2;
                }else{
                    canvas.player1 = data.p1;
                }
            }
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
