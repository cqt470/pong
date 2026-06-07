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
     * @returns {String|Number} La data e ora attuale formattata o come timestamp
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
     * @see https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
     * @param {Number} ms I millisecondi da aspettare
     */
    wait(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Ottiene l'indirizzo IP del client da una richiesta HTTP, tenendo conto di eventuali proxy o CDN
     * @param {http.IncomingMessage} req La richiesta HTTP da cui estrarre l'indirizzo IP
     * @returns {String} L'indirizzo IP del client
     */
    get_client_ip(req){
        let ip = req.headers['cf-connecting-ip']
            || req.headers['x-forwarded-for']?.split(',')[0]?.trim()
            || req.headers['x-real-ip']
            || req.socket?.remoteAddress
            || req.connection?.remoteAddress;

        // toglie il prefisso IPv6 se presente
        if(ip && ip.startsWith("::ffff:")){
            ip = ip.replace("::ffff:", "");
        }

        return ip;
    }

    /**
     * Genera un numero casuale
     * @param {number} from da che numero
     * @param {number} to a che numero
     * @param {bool} return_int ritorna un numero intero?
     * @returns {number} Il numero generato
     */
    random_number(from, to, return_int){
        const n = Math.random() * (to - from) + from;
        
        return return_int ? Math.round(n) : n;
    }
}

const utils = new Utils();

module.exports = { Utils, utils };