/*

          © 2026 cqt470 - Gioele Cairo.

               (\
                ))         )  \ \
               ((         /    . (
                \\.-"```"'`   = _/=
                  >    ,       /
                   \   )__.\  |
                    > / /  || \\
                    \\ \\  \\  \\
                     `" `"  `"  `"

*/

import { Modal } from "./modules/modal.js";

/**
 * @see https://stackoverflow.com/questions/39707836/draw-html5-canvas-on-console
 */
function consolelog_logo(){
    console.log("%c ",";padding:54px 60px;background-image:url('data:image/png;base64,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');");
    console.log(
        "%cProgetto Robotica","font-size: 28px; font-weight: bold; color: #0059ff; font-family:Arial;",
    );
    console.log(
        "%cContenuto: PONG","font-size: 16px; color: #0059ff; font-family:Arial;font-style: italic;",
    );
    console.log(`
Questo progetto è open-source e protetto da GPL-2.0. Per maggiori informazioni, consulta il repository GitHub del progetto:
https://github.com/cqt470/pong

Discord: zerokelvin_000`);
}

class Score{
    /**
     * @type {HTMLDivElement}
     */
    #element;

    constructor(element){
        // todo
    }
}

class CanvasHandler{
    #WS_URL; #modal;

    /**
     * La classe CanvasHandler si occupa di gestire il disegno sul canvas e la comunicazione con il server WebSocket.
     * @param {HTMLCanvasElement} canvas Il canvas su cui disegnare
     * @param {Object} settings
     * @param {"dev"|"prod"} settings.env L'ambiente in cui si trova il client, "dev" per sviluppo locale, "prod" per produzione. Determina l'URL del WebSocket da utilizzare.
     * @param {number} settings.pixel_size La dimensione di ogni pixel disegnato sul canvas, in pixel. Default: 6
     * @param {number} settings.bar_offset L'offset in pixel delle paddle rispetto al bordo del canvas. Default: 8
     * @param {number} settings.bar_height La altezza della paddle in pixel. Default: 4
     * @param {number} settings.bar_width La larghezza della paddle in pixel. Default: 2
     */
    constructor(canvas, settings){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.sizex = canvas.width; this.sizey = canvas.height;
        this.pixel_size = settings.pixel_size || 6;
        this.resized_sizex = Math.round(this.sizex / this.pixel_size); this.resized_sizey = Math.round(this.sizey / this.pixel_size);
        this.bar_offset = settings.bar_offset || 8;
        this.bar_height = settings.bar_height || 4;
        this.bar_width = settings.bar_width || 2;
        this.state = {
            l: null,
            r: null,
            b: null
        };

        this.uuid = crypto.randomUUID();
        console.log(`Client UUID: ${this.uuid}`);

        this.#modal = new Modal(document.querySelector(".canvas .content"));
        this.#modal.create();

        const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
        const wsHost = window.location.host;
        this.#WS_URL = settings.ws_url || `${wsScheme}://${wsHost}/ws`;

        this.#modal.set_content({
            "title": "Mi sto connettendo...",
            "desc": `URL: ${this.#WS_URL}`
        });

        /** @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket */
        this.ws = new WebSocket(this.#WS_URL);
        this.ws.addEventListener("error", (e) => {
            this.#modal.button_handler.add_button({
                "label": "Ricarica la pagina",
                "action": function(){
                    window.location.reload();
                }
            }).create().show();

            this.#modal.set_content({
                "title": "Ops, errore :(",
                "desc": "C'è stato un errore. Apri la console per sviluppatori oppure usa la sezione Network per capire di più."
            })
        })

        console.log(`WebSocket URL: ${this.#WS_URL}`);
        
        this.send_uuid();

        consolelog_logo();

        this.fill();
        this.listen();
    }

    send_uuid(){
        this.ws.addEventListener("open", () => {
            this.ws.send(JSON.stringify({
                "t": "uuid",
                "uuid": this.uuid
            }));

            this.#modal.set_content({
                "title": "Connesso",
            });
        });
    }

    fill(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.sizex, this.sizey);
    }

    render(){
        this.fill();

        if(this.state.l !== null && this.state.l !== undefined){
            this.draw_paddle(false, this.state.l);
        }

        if(this.state.r !== null && this.state.r !== undefined){
            this.draw_paddle(true, this.state.r);
        }

        if(this.state.b && typeof this.state.b.x === "number" && typeof this.state.b.y === "number"){
            this.draw_pixel(this.state.b.x, this.state.b.y, true);
        }
    }

    /**
     * Disegna un pixel sul canvas
     * @param {number} x la posizione x
     * @param {number} y la posizione y
     * @param {bool} state lo stato del pixel (on, off)
     */
    draw_pixel(x, y, state){
        if(x < 0 || x >= this.sizex) return;
        if(y < 0 || y >= this.sizey) return;

        this.ctx.fillStyle = state ? "white" : "black";
        this.ctx.fillRect(x * this.pixel_size, y * this.pixel_size, this.pixel_size, this.pixel_size);
    }

    /**
     * Disegna una paddle sul canvas
     * @param {bool} side Lato della paddle, true per destra, false per sinistra
     * @param {number} posy La posizione y della paddle
     */
    draw_paddle(side, posy){
        var x_pos = this.bar_offset;
        if(side) x_pos = this.resized_sizex - this.bar_offset;

        if(posy + this.bar_height > this.resized_sizey) posy = this.resized_sizey - this.bar_height;

        for(var x = 0; x < this.bar_width; x++){
            for(var y = 0; y < this.bar_height; y++){
                this.draw_pixel(x_pos + x, posy + y, true);
            }
        }
    }

    #ask_usernames(){
        this.#modal.set_content({
            "title": "Dati giocatori",
            "desc": "Imposta il nome utente del giocatore a sinistra"
        })

        this.#modal.input_handler.add_input({
            "label": "ciao",
            
        }).create().show();

        this.#modal.button_handler.add_button({
            "label": "Invia",
        }).create().show();
    }

    #handle_game_update(){

        const left = data?.l; const right = data?.r; const ball = data?.b;

        if(left){
            this.state.l = data.l;
        }

        if(right){
            this.state.r = data.r;
        }

        if(ball){
            this.state.b = data.b;
        }

        if(left && right && ball){
            this.#modal.hide();
            this.render();
            return;
        }

        this.#modal.show();

        if(!ball){
            this.#modal.set_content({
                "title": "Aspettando",
                "desc": "Il server non ha calcolato la posizione della pallina"
            });
        }

        if(!left && !right){
            this.#modal.set_content({
                "title": "Aspettando",
                "desc": "Nessuna delle due board è collegata"
            })
        }

        if(left && !right){
            this.#modal.set_content({
                "title": "Aspettando",
                "desc": "Solo la board sinistra è collegata"
            })
        }

        if(!left && right){
            this.#modal.set_content({
                "title": "Aspettando",
                "desc": "Solo la board destra è collegata"
            })
        }
    }

    #handle_connections(data){
        if(data.t == "ask") this.#ask_usernames();
        if(data.t == "update") this.#ask_usernames();

        return
    }

    listen(){
        this.ws.addEventListener("message", (event) => {
            if(event.target != this.ws) return;

            console.log(`IN: ${event.data} (origin: ${event.origin})`);

            let data;

            try{
                data = JSON.parse(event.data);
            }catch(err){
                console.warn(`Messaggio WebSocket ignorato: ${event.data}`);
                return;
            }

            this.#handle_connections(data);
        })
    }
}

export { CanvasHandler };