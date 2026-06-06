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
        this.state = {
            l: null,
            r: null,
            b: null
        };

        this.uuid = crypto.randomUUID();
        console.log(`Client UUID: ${this.uuid}`);

        const wsScheme = window.location.protocol === "https:" ? "wss" : "ws";
        const wsHost = window.location.host;
        this.#WS_URL = settings.ws_url || `${wsScheme}://${wsHost}/ws`;
        /** @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket */
        this.ws = new WebSocket(this.#WS_URL);

        console.log(`WebSocket URL: ${this.#WS_URL}`);
        
        this.send_uuid();

        this.fill();
        this.listen();
    }

    send_uuid(){
        this.ws.addEventListener("open", () => {
            this.ws.send(JSON.stringify({
                "t": "uuid",
                "uuid": this.uuid
            }));
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

            if(data.t == "update"){
                if(data.l !== undefined){
                    this.state.l = data.l;
                }

                if(data.r !== undefined){
                    this.state.r = data.r;
                }

                if(data.b !== undefined){
                    this.state.b = data.b;
                }

                this.render();
            }
        })
    }
}

export { CanvasHandler };