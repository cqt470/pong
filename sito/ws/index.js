// server.js

const { utils } = require("./stuff/utils");
// const handler = require("./stuff/handler");

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = 3000;

utils.app = app;

app.get("/", (req, res) => {
    utils.serve("fallback.html", res);
});

const server = http.createServer(app);

// Attacca il server WebSocket al server HTTP e ascolta sul percorso "/ws"
const wss = new WebSocketServer({ server, path: "/ws" });

app.get("/ws", (req, res) => {
    utils.serve("welcome.html", res);
});

wss.on("connection", (ws, req) => {
    utils.log("Client connesso", "INFO");
    ws.send("Unc si è VERAMENTE connesso ad un webserver :wilted_rose:");

    // Gestisce i messaggi ricevuti dal client
    ws.on("message", (data) => {
        const message = data.toString();
        utils.log(`Messaggio ricevuto: ${message}`);

        // Invia una risposta automatica al client (echo)
        ws.send(`bro tu NON devi sprecare la mia banda, "${message}"`);
    });

    ws.on("close", () => {
        utils.log("Client disconnesso");
    });
});

server.listen(PORT, () => {
    utils.log(`Server HTTP e WebSocket in ascolto su http://<url>:${PORT}/ws`, "INFO");
});