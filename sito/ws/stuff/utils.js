const path = require("node:path");

class Utils{
    constructor(){
        /**
         * @type {Express?}
         */
        this.app = null;
    }

    /**
     * Poi scrivo la descrizione lol
     * @param {boolean} formatted Deve ritornare una stringa formattata? Default: true 
     * @returns 
     */
    get_timestamp(formatted = true){
        const date = new Date();

        // vedi:    https://stackoverflow.com/questions/18889548/javascript-change-gethours-to-2-digit
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.getMonth().toString().padStart(2, "0");
        const year = date.getFullYear();

        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = date.getSeconds().toString().padStart(2, "0");

        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * Poi scrivo la descrizione lol
     * @param {String?} message Il messaggio da visualizzare
     * @param {String?} priority L'importanza del messaggio yk
     */
    log(message, priority = "DEBUG"){
        if(!message){
            this.log("Parametro 'message' vuoto.", "ERROR")
            return;
        }

        console.log(`[${this.get_timestamp()}] [${priority}] - ${message}`);
    }

    /**
     * Serve (dà, invia) un file statico e logga l'azione.
     * @param {String?} file_path Il percorso del file all'interno di ws/static/
     * @param {Response} response
     */
    serve(file_path, response){
        const base_path = path.resolve(__filename, "../../static/");
        
        response.sendFile(`${base_path}/${file_path}`);
        this.log(`Pagina servita: ${file_path}`);
    }
}

const utils = new Utils();

module.exports = { Utils, utils };