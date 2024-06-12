const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
var debug = require('debug')('nodejs-express-generated:server');

const { WebSocketServer } = require("ws");
const { decode } = require('./daas/utils');
const daasApi = require('./daas/daas');

const viewRouter = require('./routes/views');
const apiRouter = require('./routes/api');

// Database
const db = require("./db/models");

const DaasService = require('./services/daas.service');

db.sequelize.sync({ force: true })
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log("Failed to sync db: " + err.message);
    });

// Node application
const app = express();

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cors());
app.use(logger('dev'));
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
    ws.send(JSON.stringify({ message: 'Connection established' }));
    ws.on('close', () => console.log(JSON.stringify({ message: 'Client has disconnected!' })));
    ws.on('message', data => {
        wss.clients.forEach(client => {
            client.send(`${data}`);
        })
    })
    ws.onerror = function () {
        console.log({ message: 'websocket error' });
    }
})

app.set("daasApi", daasApi);

const localNode = daasApi.getNode();

const wsSendBroadcast = (clients, payload) => {
    clients.forEach(client => {
        client.send(JSON.stringify(payload));
    });
}

localNode.onDinConnected((din) => { console.log("📌 DIN Accepted: " + din); });
localNode.onDDOReceived((din) => {
    console.log("🔔 DDO received from DIN: " + din);
    localNode.locate(din);

    localNode.pull(din, (origin, timestamp, typeset, data) => {
        let readableTimestamp = new Date(timestamp * 1000).toISOString()

        try {
            let decodedData = decode(data);
            console.log(`⬇⬇ Pulling data from DIN: ${origin} - timestamp: ${readableTimestamp} - typeset: ${typeset}: `);
            console.log(`⬇⬇ Pulling data:`, decode(data));
            wsSendBroadcast(wss.clients, { event: "ddo", data: { din, typeset, ddo: decodedData } });
        } catch (error) {
            console.error(error);
        }
    });
});


server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

DaasService.loadConfig(localNode);

localNode.doPerform();



function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}


function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}


function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}