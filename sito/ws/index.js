// server.js

const { configs } = require("./stuff/configs");
const { utils } = require("./stuff/utils");
const { handler } = require("./stuff/handler");

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
require("dotenv").config({quiet: true});

const app = express();

utils.app = app;

app.get("/", (req, res) => {
    handler.serve("fallback.html", res);
});

const server = http.createServer(app);

// Attacca il server WebSocket al server HTTP e ascolta sul percorso "/ws"
const wss = new WebSocketServer({ server, path: "/ws" });

app.get("/ws", (req, res) => {
    handler.serve("welcome.html", res);
});

wss.on("connection", (ws, req) => {
    handler.handle_connections(ws, req);
});

server.listen(configs.WS_PORT, () => {
    utils.log(`Server HTTP e WebSocket in ascolto`, "INFO");
    utils.log(`Server HTTP: ${configs.urls.HTTP}`, "INFO");
    utils.log(`Server WebSocket: ${configs.urls.WS}`, "INFO");
});