// esegui questo script in un'altra console per testare la connessione WebSocket al server
// comando: node test/socket.js (è anche possibil npm run test:socket ma se anche il server
// usa nodemon potrebbe non funzionare correttamente)

const { WebSocket } = require("ws");
const { utils } = require("../stuff/utils");

ws = new WebSocket("ws://localhost:3000/ws");

ws.onerror = function(error){
    utils.log(`Errore WebSocket: ${error.message}`, "ERROR");
};

ws.onopen = async function(){
    utils.log("Connessione WebSocket aperta", "INFO");

    for(let i = 0; i < 2; i++){
        await utils.wait(1000).then(() => {
            const type = Math.round(Math.random() * 2);
            const posx = parseFloat((Math.random() * 100).toFixed(2));
            const posy = parseFloat((Math.random() * 100).toFixed(2));
            const message = [type, posx, posy];
            ws.send(JSON.stringify(message));
        });
    }

    ws.close(1000, "Test completato");
};

ws.onclose = function(){
    utils.log("Connessione WebSocket chiusa", "INFO");
}

ws.onmessage = function(event){
    utils.log(`Messaggio ricevuto: ${event.data}`, "INFO");
};