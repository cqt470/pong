class CanvasHandler{
    #WS_URL;

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

        this.#WS_URL = settings.env == "prod" ? "ws://pong.zexahost.org/ws" : "ws://localhost:3000/ws";
        /** @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket */
        this.ws = new WebSocket(this.#WS_URL);

        console.log(`WebSocket URL: ${this.#WS_URL}`);

        this.fill();
        this.listen();
    }

    fill(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.sizex, this.sizey);
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
        for(var x = 0; x < this.bar_width; x++){
            for(var y = 0; y < this.bar_height; y++){
                this.draw_pixel(x_pos + x, posy + y, true);
            }
        }
    }

    listen(){
        this.ws.addEventListener("message", (event) => {
            console.log(`IN: ${event.data} (origin: ${event.origin})`);

            const data = JSON.parse(event.data);

            if(data.t == "update"){
                this.fill();
                this.draw_paddle(false, data.l);
                this.draw_paddle(true, data.r);
                this.draw_pixel(data.b.x, data.b.y, true);
            }
        })
    }
}

export { CanvasHandler };