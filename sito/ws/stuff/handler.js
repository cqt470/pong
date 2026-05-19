const { WebSocketServer } = require("ws");
const { http } = require("http");
const path = require("node:path");
const { utils } = require("./utils");

class Handler{
    constructor(){
        /** @type {WebSocket?} */
        this.ws = null;

        /** @type {http.IncomingMessage?} */
        this.req = null;

        /** @type {String?} */
        this.remote_address = null;
    }

    /**
     * Serve (dà, invia) un file statico e logga l'azione.
     * @param {String?} file_path Il percorso del file all'interno di ws/static/
     * @param {Response} response
     */
    serve(file_path, response){
        const base_path = path.resolve(__filename, "../../static/");
        
        response.sendFile(`${base_path}/${file_path}`);
        utils.log(`Pagina servita: ${file_path}`);
    }

    _disconnect_client(code = 1000, reason = "Normal Closure"){
        this.ws.close(code, reason);
        utils.log(`Client disconnesso: ${this.req.socket.remoteAddress} (${reason})`, "INFO");
    }

    _handle_messages(incoming_data){
        const datatype = typeof incoming_data;
        
        if(datatype != "object"){
            this._disconnect_client(1003, "Tipo di dato non supportato");
            return;
        }

        // TODO: aggiungere in un configs il limite di dimensione
        if(incoming_data.length > 127){
            this._disconnect_client(1003, `Messaggio troppo grande, ${incoming_data.length} byte`);
            return;
        }

        utils.log(`Messaggio ricevuto: ${incoming_data}`, "INFO");
    }

    _handle_closes(){
        utils.log(`Client disconnesso: ${this.req.socket.remoteAddress}`, "INFO");
    }

    /**
     * Gestisce le connessioni del server
     * @see https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
     * @param {WebSocket} ws La connessione WebSocket con il client
     * @param {http.incomingMessage} req La richiesta HTTP che ha portato alla connessione WebSocket
     */
    handle_connections(ws, req){
        // TODO: confermare che questo dia effettivamente l'indirizzo pubblico
        this.remote_address = req.socket.remoteAddress;
        this.ws = ws; this.req = req;

        utils.log(`Client connesso: ${req.socket.remoteAddress}`, "INFO");

        ws.on("message", (data) => this._handle_messages(data));
        ws.on("close", () => this._handle_closes());
    }
}

const handler = new Handler();

module.exports = { Handler, handler };