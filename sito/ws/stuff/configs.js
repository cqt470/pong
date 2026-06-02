require("dotenv").config({quiet: true});

const { utils } = require("./utils");

class Configs{
    constructor(){
        if(!process.env.ENV){
            utils.log("La variabile d'ambiente ENV non è stata impostata, si assume DEV", "WARN");
            this.env = "DEV";
        }else{
            this.env = process.env.ENV.toUpperCase();
        }

        this.urls = {"HTTP": null, "WS": null};

        this.urls = {
            "HTTP": this.env == "PROD" ? process.env.URL_HTTP_PROD : process.env.URL_HTTP_DEV,
            "WS": this.env == "PROD" ? process.env.URL_WS_PROD : process.env.URL_WS_DEV
        };

        if(!process.env.PORT){
            utils.log("La variabile d'ambiente PORT non è stata impostata, si assume 4000", "WARN");
            this.WS_PORT = 4000;
        }else{
            this.WS_PORT = process.env.PORT;
        }

        if(this.env == "DEV"){
            this.urls.HTTP = `${this.urls.HTTP}:${this.WS_PORT}`;
            this.urls.WS = `${this.urls.WS}:${this.WS_PORT}/ws`;
        }

        this.MAX_MESSAGE_SIZE = 127;

        /* DEBUG
        console.log(`Configurazione caricata:`);
        console.log(`MAX_MESSAGE_SIZE: ${this.MAX_MESSAGE_SIZE}`);
        console.log(`WS_PORT: ${this.WS_PORT}`);
        console.log(`URLs:`);
        for(const [key, value] of Object.entries(this.urls)) {
            console.log(`  ${key}: ${value}`);
        }
        */
    }
}

const configs = new Configs();

module.exports = { Configs, configs };