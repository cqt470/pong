// server.js

const { utils } = require("./stuff/utils");
const { handler } = require("./stuff/handler");

const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");
require("dotenv").config({quiet: true});

const app = express();
const PORT = 3000;

const URL_HTTP = process.env.ENV == "PROD" ? process.env.URL_HTTP_PROD : process.env.URL_HTTP_DEV;
const URL_WS = process.env.ENV == "PROD" ? process.env.URL_WS_PROD : process.env.URL_WS_DEV;

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

server.listen(PORT, () => {
    utils.log(`Server HTTP e WebSocket in ascolto`, "INFO");
    utils.log(`Server HTTP: ${URL_HTTP}`, "INFO");
    utils.log(`Server WebSocket: ${URL_WS}`, "INFO");
});