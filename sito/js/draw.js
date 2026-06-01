class Draw{
    #WS_URL;

    /**
     * La classe Draw si occupa di gestire il disegno sul canvas e la comunicazione con il server WebSocket.
     * @param {HTMLCanvasElement} canvas Il canvas su cui disegnare
     * @param {Object} settings
     * @param {"dev"|"prod"} settings.env L'ambiente in cui si trova il client, "dev" per sviluppo locale, "prod" per produzione. Determina l'URL del WebSocket da utilizzare.
     */
    constructor(canvas, settings){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.#WS_URL = settings.env == "prod" ? "ws://pong.zexahost.org/ws" : "ws://localhost:3000/ws";

        console.log(`WebSocket URL: ${this.#WS_URL}`);

        this.fill();
    }

    fill(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Draw };