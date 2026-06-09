const { WebSocketServer } = require("ws");
const { http } = require("http");
const path = require("node:path");
const { utils } = require("./utils");
const { Ball } = require("./ball");
const { Player } = require("./player");

class Handler{
    constructor(){
        /** @type {Object[]} */
        this.clients = [];
        this.latestState = {
            l: null,
            r: null,
            b: null
        };

        this.player_left = new Player();
        this.player_right = new Player();
        this.ball = new Ball({
            "player_left": this.player_left,
            "player_right": this.player_right,
        });

        this.broadcastInterval = setInterval(() => {
            this.#broadcast_state();
        }, 1000 / 24);

        this.heartbeatInterval = setInterval(() => {
            for(const client of this.clients){
                const socket = client.socket;

                if(!socket){
                    continue;
                }

                if(socket.isAlive === false){
                    utils.log(`Heartbeat scaduto per ${client.uuid} (${client.address})`, "WARN");
                    try{ socket.terminate(); }catch(e){}
                    continue;
                }

                socket.isAlive = false;

                try{
                    socket.ping();
                }catch(err){
                    utils.log(`Impossibile pingare ${client.uuid} (${client.address}): ${err.message}`, "ERROR");
                }
            }
        }, 15000);

        if(typeof this.heartbeatInterval.unref === "function"){
            this.heartbeatInterval.unref();
        }

        if(typeof this.broadcastInterval.unref === "function"){
            this.broadcastInterval.unref();
        }

        this.usernames = null;
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

    #set_uuid(data, ws, remote){
        const next_client = {
            "uuid": data.uuid,
            "slave": data.slave === true,
            "address": remote,
            "socket": ws,
            "sideKey": null
        };

        const existing_index = this.clients.findIndex((client) => client.uuid === data.uuid);

        if(existing_index >= 0){
            this.clients[existing_index] = next_client;
            utils.log(`Client uuid duplicato aggiornato: ${data.uuid} (${remote})`, "WARN");
        }else{
            this.clients.push(next_client);
        }

        console.log(this.clients.map(({uuid, slave, address}) => ({uuid, slave, address})));
    }

    #remove_client(ws, remote){
        const uuid = ws?.uuid;
        const before = this.clients.length;
        const client = uuid
            ? this.clients.find((entry) => entry.uuid === uuid)
            : this.clients.find((entry) => entry.address === remote);

        if(client?.sideKey === "l"){
            this.latestState.l = null;
        }

        if(client?.sideKey === "r"){
            this.latestState.r = null;
        }

        if(uuid){
            this.clients = this.clients.filter((client) => client.uuid !== uuid);
        }else{
            this.clients = this.clients.filter((client) => client.address !== remote);
        }

        const removed = before - this.clients.length;
        utils.log(`Rimosso ${removed} client/i (${uuid || remote}). Rimasti: ${this.clients.length}`, "INFO");
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
            ws.isAlive = true;
            this.#set_uuid(data, ws, remote);
            return;
        }

        if(type === "update" && ws.isSlave === true){
            if(data.l !== undefined){
                ws.sideKey = "l";
                this.latestState.l = data.l;
            }

            if(data.r !== undefined){
                ws.sideKey = "r";
                this.latestState.r = data.r;
            }

            if(data.b !== undefined){
                this.latestState.b = data.b;
            }

            if(ws.uuid){
                const client = this.clients.find((entry) => entry.uuid === ws.uuid);

                if(client){
                    client.sideKey = ws.sideKey;
                }
            }

            ws.isAlive = true;
            return;
        }

        if(type === "reply"){
            const question = data?.q;

            if(!question){
                ws.send(JSON.stringify({
                    "t": "error",
                    "message": "Risposta priva di riferimento alla domanda"
                }));
                this.#disconnect_client(ws, remote, 1003, "Risposta priva di riferimento alla domanda");
                return;
            }

            if(question == "usernames"){
                if(this.usernames) return;

                const u1 = data?.d?.u1; const u2 = data?.d?.u2;

                if(!u1 || !u2 || (u1 == u2)) return;

                this.usernames = {"left": u1, "right": u2};
                utils.log(`Utenti registrati: "${u1}" e "${u2}"`, "NOTICE");
            }
        }

        // utils.log(`Messaggio ricevuto: ${incoming_data}`, "DEBUG");
    }

    #handle_closes(ws, remote, code, reason){
        this.#remove_client(ws, remote);
        utils.log(`Client disconnesso: ${remote} code=${code} reason=${reason}`, "INFO");
    }

    #broadcast_state(){
        if(!this.usernames) return;

        const has_state = this.latestState.l !== null
            || this.latestState.r !== null
            || this.latestState.b !== null;

        /*
        if(!has_state){
            return;
        }
        */

        if(this.latestState.l && this.latestState.r){
            this.ball.update_position(this.latestState.l, this.latestState.r);
            this.latestState.b = this.ball.position;
        }

        const payload = JSON.stringify({
            t: "update",
            l: this.latestState.l,
            r: this.latestState.r,
            b: this.latestState.b,
            s: this.ball.get_scores()
        });

        for(const client of this.clients){
            if(client.slave === true){
                continue;
            }

            const socket = client.socket;
            if(!socket || socket.readyState !== 1){
                continue;
            }

            try{
                socket.send(payload);
            }catch(err){
                utils.log(`Broadcast fallito verso ${client.uuid} (${client.address}): ${err.message}`, "ERROR");
            }
        }
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
        ws.isAlive = true;

        utils.log(`Client connesso: ${remote}`, "INFO");
        utils.log(`Upgrade path: ${req.url}`, "DEBUG");
        utils.log(`Headers UA: ${req.headers["user-agent"] || "n/a"}`, "DEBUG");

        if(!this.usernames){
            ws.send(JSON.stringify({"t": "ask", "d": "usernames"}));
        }

        ws.on("message", (data) => this.#handle_messages(data, ws, remote));
        ws.on("pong", () => {
            ws.isAlive = true;
        });
        ws.on("close", (code, reason) => this.#handle_closes(ws, remote, code, reason?.toString?.() || ""));
        ws.on("error", (err) => utils.log(`Errore WS da ${remote}: ${err.message}`, "ERROR"));
    }
}

const handler = new Handler();

module.exports = { Handler, handler };