const express = require('express');
const http = require('http');
var path = require('path');
const { WebSocketServer } = require("ws");
// const { DaasIoT } = require("daas-sdk");
const { decode } = require('./daas/utils');
const daasApi = require('./daas');

const viewRouter = require('./routes/views');
const apiRouter = require('./routes/api');

const PORT = 3000;

// Node application
const app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', viewRouter);
app.use('/api', apiRouter);


// Web Server
const server = http.createServer(app);

// server.listen(PORT, () => {
//     console.log(`Server listening on PORT ${PORT}`);
// });


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

app.set("daasApi", daasApi);

function initAndStartDaasNode() {
    return new Promise((resolve) => {
        const INET4 = 2;
        const SID = 100;
        const DIN = 101;

        const drivers = [
            [INET4, "127.0.0.1:2101"]
        ];

        const devices = [
            [102, INET4, "127.0.0.1:2102"]
        ];

        daasApi.doInit(SID, DIN);

        drivers.forEach(([driver, url]) => {
            console.log(`enableDriver: ${driver} ${url}`);
            daasApi.enableDriver(driver, url);
        });

        devices.forEach(([din, driver, url]) => {
            console.log(`map: ${driver} ${url}`);
            daasApi.map(din, driver, url);
        });

        daasApi.onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });
        daasApi.onDDOReceived((din) => {
            console.log("🔔 DDO received from DIN: " + din);
            daasApi.locate(din);

            daasApi.pull(din, (origin, timestamp, typeset, data) => {
                let readableTimestamp = new Date(timestamp * 1000).toISOString()
                console.log(`⬇⬇ Pulling data from DIN: ${origin} - timestamp: ${readableTimestamp} - typeset: ${typeset}: ${data}`);
                console.log(data);
                let decodedData = decode(data);

                wss.clients.forEach(client => {
                    console.log(`distributing message: ${data}`)
                    client.send(JSON.stringify(decodedData));
                })
            });
        });

        daasApi.doPerform();

        resolve();
    });
};


async function startServer() {
    await initAndStartDaasNode();

    server.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    });
}

startServer();