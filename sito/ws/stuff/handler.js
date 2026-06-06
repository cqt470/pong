const { WebSocketServer } = require("ws");
const { http } = require("http");
const path = require("node:path");
const { utils } = require("./utils");

class Handler{
    constructor(){
        /** class holds no per-connection state; clients tracked here */
        /** @type {Object[]} */
        this.clients = [];
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

    #disconnect_client(ws, remote, code = 1000, reason = "Normal Closure"){
        try{ ws.close(code, reason); }catch(e){}
        utils.log(`Client disconnesso: ${remote} (${reason})`, "INFO");
    }

    #set_uuid(data, remote){
        this.clients.push({
            "uuid": data.uuid,
            "slave": data.slave === true,
            "address": remote
        });

        console.log(this.clients);
    }

    #handle_messages(incoming_data, ws, remote){
        const datatype = typeof incoming_data;

        if(datatype != "string" && datatype != "object"){
            this.#disconnect_client(ws, remote, 1003, "Tipo di dato non supportato");
            return;
        }

        // TODO: aggiungere in un configs il limite di dimensione
        if(incoming_data.length > 127){
            this.#disconnect_client(ws, remote, 1003, `Messaggio troppo grande, ${incoming_data.length} byte`);
            return;
        }

        let data;

        try{
            data = JSON.parse(incoming_data);
        }catch(err){
            utils.log(`Messaggio non JSON da ${remote}: ${incoming_data}`, "WARN");
            return;
        }
        const type = data?.t;

        if(!type){
            ws.send(JSON.stringify({
                "t": "error",
                "message": "Messaggio privo di tipo"
            }));
            this.#disconnect_client(ws, remote, 1003, "Messaggio privo di tipo");
            return;
        }

        if(type === "uuid"){
            ws.isSlave = data.slave === true;
            ws.uuid = data.uuid;
            utils.log(`Client ${remote} registrato come ${ws.isSlave ? "slave" : "master"} (uuid=${data.uuid})`, "INFO");
            this.#set_uuid(data, remote);
        }

        utils.log(`Messaggio ricevuto: ${incoming_data}`, "INFO");
    }

    #handle_closes(remote){
        utils.log(`Client disconnesso: ${remote}`, "INFO");
    }

    /**
     * Gestisce le connessioni del server
     * @see https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
     * @param {WebSocket} ws La connessione WebSocket con il client
     * @param {http.incomingMessage} req La richiesta HTTP che ha portato alla connessione WebSocket
     */
    handle_connections(ws, req){
        const remote = utils.get_client_ip(req);

        ws.isSlave = null;
        ws.uuid = null;

        utils.log(`Client connesso: ${remote}`, "INFO");
        utils.log(`Upgrade path: ${req.url}`, "DEBUG");
        utils.log(`Headers UA: ${req.headers["user-agent"] || "n/a"}`, "DEBUG");

        this.#send_random_data(ws, remote);

        ws.on("message", (data) => this.#handle_messages(data, ws, remote));
        ws.on("close", (code, reason) => this.#handle_closes(`${remote} code=${code} reason=${reason?.toString?.() || ""}`));
        ws.on("error", (err) => utils.log(`Errore WS da ${remote}: ${err.message}`, "ERROR"));
    }

    async #send_random_data(ws, remote){
        while(ws && ws.readyState === 1){
            await utils.wait(1000 / 1); // 1 Hz

            if(ws.isSlave !== false){
                continue;
            }

            try{
                const pos_left = Math.floor(Math.random() * 64);
                const pos_right = Math.floor(Math.random() * 64);
                const pos_ball = {
                    x: Math.floor(Math.random() * 128),
                    y: Math.floor(Math.random() * 64)
                };

                ws.send(JSON.stringify({
                    "t": "update",
                    "r": pos_right,
                    "l": pos_left,
                    "b": pos_ball
                }));
            }catch(err){
                utils.log(`Errore invio dati a ${remote}: ${err.message}`, "ERROR");
                break;
            }
        }
    }
}

const handler = new Handler();

module.exports = { Handler, handler };