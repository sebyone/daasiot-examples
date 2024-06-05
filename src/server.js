const express = require('express');
const http = require('http');
var path = require('path');
const { WebSocketServer } = require("ws");
const { decode } = require('./daas/utils');
const daasApi = require('./daas/daas');

const viewRouter = require('./routes/views');
const apiRouter = require('./routes/api');

// const DinLocal = require('./db/models/dinlocal');

// Database
const db = require("./db/models");
const DinLocal = db.DinLocal;



db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

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


// Web Socket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log('New client connected!');
    ws.send('Connection established');

    ws.on('close', () => console.log('Client has disconnected!'));

    ws.on('message', data => {
        wss.clients.forEach(client => {
            client.send(`${data}`);
        })
    })

    ws.onerror = function () {
        console.log('websocket error');
    }
})

app.set("daasApi", daasApi);

async function initAndStartDaasNode() {
    try {
        const result = await DinLocal.findByPk(1, { raw: true, include: ['din'] });
        console.log("configData", result);
    } catch (error) {
        console.error(error);
    }

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

        daasApi.getNode().doInit(SID, DIN);

        drivers.forEach(([driver, url]) => {
            console.log(`enableDriver: ${driver} ${url}`);
            daasApi.getNode().enableDriver(driver, url);
        });

        devices.forEach(([din, driver, url]) => {
            console.log(`map: ${driver} ${url}`);
            daasApi.getNode().map(din, driver, url);
        });

        daasApi.getNode().onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });
        daasApi.getNode().onDDOReceived((din) => {
            console.log("🔔 DDO received from DIN: " + din);
            daasApi.getNode().locate(din);

            daasApi.getNode().pull(din, (origin, timestamp, typeset, data) => {
                let readableTimestamp = new Date(timestamp * 1000).toISOString()
                console.log(`⬇⬇ Pulling data from DIN: ${origin} - timestamp: ${readableTimestamp} - typeset: ${typeset}: ${data}`);
                console.log(data);
                let decodedData = decode(data);

                wss.clients.forEach(client => {
                    console.log(`distributing message: ${data}`)
                    client.send(JSON.stringify({ type: "ddo", data: { din, typeset, ddo: decodedData } }));
                })
            });
        });

        daasApi.getNode().doPerform();

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