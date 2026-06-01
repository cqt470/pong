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

    #disconnect_client(code = 1000, reason = "Normal Closure"){
        this.ws.close(code, reason);
        utils.log(`Client disconnesso: ${this.remote_address} (${reason})`, "INFO");
    }

    #handle_messages(incoming_data){
        const datatype = typeof incoming_data;
        
        if(datatype != "object"){
            this.#disconnect_client(1003, "Tipo di dato non supportato");
            return;
        }

        // TODO: aggiungere in un configs il limite di dimensione
        if(incoming_data.length > 127){
            this.#disconnect_client(1003, `Messaggio troppo grande, ${incoming_data.length} byte`);
            return;
        }

        utils.log(`Messaggio ricevuto: ${incoming_data}`, "INFO");
    }

    #handle_closes(){
        utils.log(`Client disconnesso: ${this.remote_address}`, "INFO");
    }

    /**
     * Gestisce le connessioni del server
     * @see https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
     * @param {WebSocket} ws La connessione WebSocket con il client
     * @param {http.incomingMessage} req La richiesta HTTP che ha portato alla connessione WebSocket
     */
    handle_connections(ws, req){
        this.remote_address = utils.get_client_ip(req);
        this.ws = ws; this.req = req;

        utils.log(`Client connesso: ${this.remote_address}`, "INFO");
        
        this.#send_random_data();

        ws.on("message", (data) => this.#handle_messages(data));
        ws.on("close", () => this.#handle_closes());
    }

    async #send_random_data(){
        while(this.ws && this.ws.readyState === 1){
            await utils.wait(1000 / 1); // 24 FPS

            try{
                const pos_left = Math.floor(Math.random() * 64);
                const pos_right = Math.floor(Math.random() * 64);
                const pos_ball = {
                    x: Math.floor(Math.random() * 128),
                    y: Math.floor(Math.random() * 64)
                };

                this.ws.send(JSON.stringify({
                    "t": "update",
                    "r": pos_right,
                    "l": pos_left,
                    "b": pos_ball
                }));
            }catch(err){
                utils.log(`Errore invio dati a ${this.remote_address}: ${err.message}`, "ERROR");
                break;
            }
        }
    }
}

const handler = new Handler();

module.exports = { Handler, handler };