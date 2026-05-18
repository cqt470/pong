// server.js
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3000;

// Servire un file HTML statico (lo creeremo dopo)
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = http.createServer(app);

// Attacca il server WebSocket al server HTTP e ascolta sul percorso '/ws'
const wss = new WebSocketServer({ server, path: '/ws' });

app.get('/ws', (req, res) => {
    res.send(`
        <h1>WebSocket Endpoint</h1>
        <p>Questo è l'endpoint WebSocket. Usa un client WebSocket per connetterti.</p>
        <p>URL: ws://${req.headers.host}/ws</p>
    `);
});

wss.on('connection', (ws, req) => {
    console.log(`[Server] Client connesso!`);
    ws.send('Benvenuto! Sei connesso al server WebSocket.');

    // Gestisce i messaggi ricevuti dal client
    ws.on('message', (data) => {
        const message = data.toString();
        console.log(`[Server] Messaggio ricevuto: ${message}`);

        // Invia una risposta automatica al client (echo)
        ws.send(`Server dice: Ho ricevuto il tuo messaggio: "${message}"`);
    });

    ws.on('close', () => {
        console.log(`[Server] Client disconnesso.`);
    });
});

server.listen(PORT, () => {
    console.log(`Server HTTP e WebSocket in ascolto su http://localhost:${PORT}/ws`);
});