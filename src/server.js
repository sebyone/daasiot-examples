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
const DinLink = db.DinLink;

const { where, Op } = require('sequelize');

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

const localNode = daasApi.getNode();

localNode.onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });
localNode.onDDOReceived((din) => {
    console.log("🔔 DDO received from DIN: " + din);
    localNode.locate(din);

    localNode.pull(din, (origin, timestamp, typeset, data) => {
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

async function initAndStartDaasNode(node) {
    try {
        const dinLocal = await DinLocal.findByPk(1, { raw: true, include: ['din'] });
        const dinLocalLinks = await await DinLink.findAll({
            where: {
                din_id: {
                    [Op.eq]: 1
                }
            },
            raw: true
        });

        const sid = parseInt(dinLocal['din.sid']);
        const din = parseInt(dinLocal['din.din']);

        // Init nodo
        node.doInit(sid, din);
        console.log(`daas:doInit sid=${sid} din=${din}`);

        // Enable node links
        dinLocalLinks.forEach((llink) => {
            let link = parseInt(llink.link);
            let url = llink.url;

            node.enableDriver(link, url);
            console.log(`daas:enableDriver link=${link} din=${url}`);
        });

        const devices = [
            [102, 2, "127.0.0.1:2102"]
        ];

        devices.forEach(([din, driver, url]) => {
            node.map(din, driver, url);
            console.log(`daas:map din=${din} link=${driver} url=${url}`);
        });

    } catch (error) {
        console.error(error);
    }
};


async function startServer() {
    await initAndStartDaasNode(localNode);
    await localNode.doPerform();
    console.log(`daas:doPerform`);

    server.listen(PORT, () => {
        console.log(`Server listening on PORT ${PORT}`);
    });
}

startServer();