/**
 * Server Connection Name Space
 */
var Connection = function(game) {

    var SERVER_ADDR = '127.0.0.1',

        PORT = 3000,

        socket,

        // Defines which player ('p1', 'p2'). Stores the html element ID
        playerElm,

        // player buttons to bind click event
        playerButtons,

        // loop index
        i = 0,

        h3 = undefined,

        that = this,


        /**
         * Function that send messages to the server
         * param message: data to send to server
         */
        msg = function (message) {

              socket.send(message);
              console.log(message);
        },


        /**
         * Callback for client connection on server
         */
        onConnectCallback = function() {

            var text = that.playerElm.id + ' connected';
            that.playerElm.childNodes[0].textContent = text;
        },


        /*
         * When server sends a message this function is called
         */
        onMessageCallback = function(data) {

            /* Triggers the start event to begin the game */
            if (data === 'start') {

                h3.textContent = "The best player win!";

                var startEvent = new Event('start');
                window.dispatchEvent(startEvent);

            } else {

                /* sets the other player positions on canvas */
                if (that.playerElm.id == 'p1') {

                    canvas.player2 = data.p2;
                } else {

                    canvas.player1 = data.p1;
                }
            }
        },


        /*
         * When client disconnect this function is called and shows a 
         * message to the user that disconnected
         */
        onDisconnectCallback = function() {

            var text = that.playerElm.id + ' disconnected';
            that.playerElm.childNodes[0].textContent = text;
        },


        /**
         * Function that connects to the server
         * param element: html element id to be connected ('p1' or 'p2')
         */
        connect = function(event) {

            var listener = function () {
                return false;
            };

            that.playerElm = this.parentElement;

            /* unbind the other button to not let the user create
             * another player
             */
            if(that.playerElm.id === 'p1') {

                playerButtons[1].removeEventListener('click', listener);
            } else {

                playerButtons[0].removeEventListener('click', listener);
            }

            /* Creates an IO Socket with the server address binding on PORT */
            socket = new io(SERVER_ADDR + ":" + PORT);

            socket.on('connect', onConnectCallback);
            socket.on('message', onMessageCallback);
            socket.on('disconnect', onDisconnectCallback);

            socket.connect();

            event.preventDefault();
            event.stopPropagation();
        };


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


    /* Name Space Public methods and attributes */
    return {
        connect: function(elm) {
            return connect(elm);
        },

        socket: socket,

        msg: function (message) {
            return msg(message);
        },

        playerElm: playerElm

    }
};
