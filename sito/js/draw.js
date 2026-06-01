class Draw{
    constructor(canvas){
        /**
         * @type {HTMLCanvasElement} Il canvas su cui disegnare
         */
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");

        this.fill();
    }

    fill(){
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Draw };