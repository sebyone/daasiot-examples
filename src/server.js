/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: server.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * vincenzo.petrungaro@gmail.com - initial implementation
 * alessio.farfaglia@gmail.com - maintenance and updates
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const logger = require('morgan');
var debug = require('debug')('nodejs-express-generated:server');

const { WebSocketServer } = require("ws");
const { decode, getTime } = require('./daas/utils');
const daasApi = require('./daas/daas');

const viewRouter = require('./routes/views');
const apiRouter = require('./routes/api');

// Database
const db = require("./db/models");

const DaasService = require('./services/daas.service');

// Node application
const app = express();

const SegfaultHandler = require('segfault-handler');

SegfaultHandler.registerHandler('crash.log');

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

// print all the api routes with their methods as curl commands to test
// apiRouter.stack.forEach(r => {
//     if (r.route && r.route.path) {
//         console.log(`curl -X ${Object.keys(r.route.methods).join(', ').toUpperCase()}\t localhost:${port}/api${r.route.path}`);
//     }
// });


// Web Socket
const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    console.log(getTime(), 'New client connected!');
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


localNode.onDDOReceived((din) => {
    console.log(getTime(), "🔔 DDO received from DIN:", din);
    localNode.locate(din);

    localNode.pull(din, (origin, timestamp, typeset, data) => {
        // let readableTimestamp = new Date(timestamp * 1000).toISOString().replace(/T/, ' ').replace(/\..+/, '')

        const currTimestamp = Math.floor(new Date().getTime() / 1000);
        const secondsSinceMessageWasSent = currTimestamp - timestamp;

        try {
            let decodedData = decode(data);
            console.log(getTime(), `⬇⬇ Pulling data from DIN:`, origin, `| typeset: ${typeset} | ${secondsSinceMessageWasSent}s ago`);
            console.log(decodedData);

            wsSendBroadcast(wss.clients, { event: "ddo", data: { din, typeset, ddo: decodedData } });
        } catch (error) {
            console.error(getTime(), error);
        }
    });
});


db.sequelize.sync({ force: false })
    .then(() => {
        console.log(getTime(), "Synced db.");

        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);

        console.log(getTime(), `server listen on ${port} port`)

        DaasService.loadConfig(localNode).then(() => {
            if (localNode.doPerform()) {
                console.log(getTime(), `[daas] doPerform OK`)
            } else {
                console.error(getTime(), `[daas] doPerform ERROR`);
            }
        }).catch((err) => {
            console.error(getTime(), `[daas] loadConfig ERROR: ${err.message}`);
        });
    })
    .catch((err) => {
        console.log(getTime(), "Failed to sync db: " + err.message);
    });

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
