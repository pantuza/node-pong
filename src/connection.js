/**
 * Server Connection Name Space
 */
var Connection = function(game) {

    var SERVER_ADDR = '127.0.0.1',
        PORT = 3000,

        socket,

        // Defines which player ('p1', 'p2'). Stores the html element ID
        //playerElm,

        // player buttons to bind click event
        playerButtons,
        // loop index
        i = 0,

        h3 = undefined,

        /*
         * Function that send messages to the server
         * param message: data to send to server
         */
        msg = function (message) {
              socket.send(message);
              console.log(message);
        },

        /* Callback for client connection on server
         *
         */
        onConnectCallback = function() {
            playerElm.childNodes[0].textContent = playerElm.id + ' connected';
        },


        /*
         * When server sends a message this function is called
         */
        onMessageCallback = function(data) {

            if (data == 'start'){
                h3.textContent = "The best player win!";
                game.init();

            } else {
                // create users
                if (playerElm.id == 'p1') {
                    canvas.player2 = data.p2;
                } else {
                    canvas.player1 = data.p1;
                }
            }
        },


        /*
         * When client disconnect this function is called
         */
        onDisconnectCallback = function() {
            /* Shows a message to the user that disconnected */
            playerElm.childNodes[0].textContent = playerElm.id + ' disconnected';
        },


        /*
         * Function that connects to the server
         * param element: html element id to be connected ('p1' or 'p2')
         */
        connect = function(event) {

            var listener = function () {
                return false;
            };

            window.playerElm = this.parentElement;
            //window.playerElm = playerElm;

            // unbind the other button to not let the user create another player
            if(playerElm.id === 'p1') {
                playerButtons[1].removeEventListener('click', listener);
            } else {
                playerButtons[0].removeEventListener('click', listener);
            }
            // instâcia um objeto do iosocket passando o endereço do servidor e a porta de conexão
            socket = new io(SERVER_ADDR + ":" + PORT);

            socket.on('connect', onConnectCallback);
            socket.on('message', onMessageCallback);
            socket.on('disconnect', onDisconnectCallback);

            socket.connect();

            event.preventDefault();
            event.stopPropagation();
        };


        /* Name Space contructor */
        (function() {

            playerButtons = document.querySelectorAll("#p1 a, #p2 a");

            for( ; i < playerButtons.length; i++) {
                playerButtons[i].addEventListener('click', connect, false);
            }

            startButton = document.getElementById('start');
            startButton.addEventListener('click', function (event) {
                msg('start');
                event.preventDefault();
                event.stopPropagation();
            });

            h3 = document.getElementById('canvas_header');

            window.msg = msg;

        })();

    /* Name Space Public methods and attributes */
    return {
        connect: function(elm) {
            return connect(elm);
        },

        socket: socket,

        msg: function (message) {
            return msg(message);
        }

    }
};
