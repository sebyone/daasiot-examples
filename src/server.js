const express = require('express');
const http = require('http');
var path = require('path');
const { WebSocketServer } = require("ws");
const { DaasIoT } = require("./libs/libdaas.node");

const port = 3000

function decode(data) {
    let utf8decoder = new TextDecoder();
    let decodedData = utf8decoder.decode(data);

    return JSON.parse(decodedData);
}

// Node application
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
    res.render("pages/index")
})


// Web Server
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


// Web Socket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('New client connected!');
    ws.send('Connection established');

    ws.on('close', () => console.log('Client has disconnected!'))

    ws.on('message', data => {
        wss.clients.forEach(client => {
            console.log(`distributing message: ${data}`)
            client.send(`${data}`)
        })
    })

    ws.onerror = function () {
        console.log('websocket error')
    }
})


// Daas-IoT
const INET4 = 2;

const SID = 100;
const DIN = 101;
const URL = "127.0.0.1:2101"

const REMOTE_DIN = 102;
const REMOTE_URL = "127.0.0.1:2102";

const hver = "nodeJS";

const daasApi = new DaasIoT(hver);

daasApi.onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });
daasApi.onDDOReceived((din) => {
    console.log("🔔 DDO received from DIN: " + din);
    daasApi.locate(din);

    daasApi.pull(din, (origin, timestamp, typeset, data) => {
        let readableTimestamp = new Date(timestamp * 1000).toISOString()
        console.log(`⬇⬇ Pulling data from DIN: ${origin} - timestamp: ${readableTimestamp} - typeset: ${typeset}: ${data}`);
        let decodedData = decode(data);

        wss.clients.forEach(client => {
            console.log(`distributing message: ${data}`)
            client.send(JSON.stringify(decodedData));
        })
    });
});

daasApi.doInit(SID, DIN);

if (daasApi.enableDriver(INET4, URL)) {
    console.log("Driver enabled!");
}

daasApi.map(REMOTE_DIN, INET4, REMOTE_URL);

if (daasApi.doPerform()) {
    console.log("Node performed!");
}

setInterval(() => {
    const located = daasApi.locate(REMOTE_DIN);
    console.log(`🔍 Locate ${REMOTE_DIN}: ${located}`);

    if (located) {
        const payload = {
            message: "Hello World!!!"
        }

        let timestamp = new Date().getTime();

        daasApi.push(REMOTE_DIN, 10, timestamp, JSON.stringify(payload));
        console.log(`⬆⬆ Pushing data to ${REMOTE_DIN} done.`);
    }
}, 5000)

app.set("daasApi", daasApi);
console.log(`🟢 DaasIoT Node enabled! (sid: ${SID} | din: ${DIN} | host: ${URL})`)