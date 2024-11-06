const express = require('express');
const router = express.Router();
const DaasService = require('../../services/daas.service');
const { createDDO } = require('../../services/ddo.service');
const daasNode = require('../../daas/daas');
const db = require("../../db/models");
const { sendError } = require('./utilities');

module.exports = {
    router
};


router.get('/', function (req, res) {
    res.send({
        name: "DaasIoT API",
        version: 0,
        message: "OK",
    });
});

// carica la configurazione del nodo locale (per il din_local con id=1)
router.post('/configure', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        await DaasService.loadConfig(daasNode.getNode());
        res.send({ message: "Applicata configurazione." })
    } catch (error) {
        sendError(res, error);
    }
})


// Ferma il nodo
router.post('/stop', function (req, res) {
    console.log("[API] /stop Node stopped.");
    try {
        const isStopped = daasNode.stop();

        if (!isStopped) {
            throw new Error("Impossibile fermare il nodo.");
        }
        console.log("isStopped", isStopped);

        res.send({ message: "Nodo stoppato." });
    } catch (err) {
        sendError(res, err);
    }
});

// Avvia il nodo
router.post('/start', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        // Esegue init nodo data
        await DaasService.loadConfig(daasNode.getNode());

        daasNode.start();
        res.send({ message: "Nodo locale avviato." });
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/restart', async function (req, res) {
    console.log("[API] /restart Node restarted.");
    try {
        // TODO: IMPLEMENT
        res.status(501)
        throw new Error("Not ancora implementato.");
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/send', async function (req, res) {
    console.log("[API] /send body:", req.body);
    try {
        console.log("req.body", req.body);

        const din = parseInt(req.body.din);
        const typeset = parseInt(req.body.typeset);
        const payload = req.body.payload || '';
        const b64_payload = Buffer.from(payload).toString('base64');
        const timestampSeconds = Math.floor(new Date().getTime() / 1000);

        daasNode.send(din, typeset, b64_payload);

        // TODO: add checks for din not found, etc.
        const sender = await db.DinLocal.findByPk(1, { include: ['din'] });
        if (!sender) {
            throw new Error("DinLocal not found");
        }
        const sender_din = sender.din.din;
        console.log("sender_din", sender_din);
        const ddo = await createDDO(sender_din, din, payload, timestampSeconds, typeset);
        res.send(ddo);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/status', function (req, res) {
    // Ritorna lo status di tutti i nodi locali.
    console.log("Node", daasNode.getNode().getStatus());
    res.send(daasNode.getNode().getStatus())
});

router.get('/version', function (req, res) {
    const version = daasNode.getNode().getVersion();
    res.send(version);
});


router.post('/dev/db_sync', async function (req, res) {
    try {
        const force = req.body.force || false;
        console.warn(`[API] /dev/db_sync force=${force}`);

        // only in development env
        if (process.env.NODE_ENV !== 'development') {
            res.status(403);
            throw new Error("Non è possibile sincronizzare il database in un ambiente di produzione.");
        }

        await db.sequelize.sync({ force: force });
        res.send({ message: "Database sincronizzato" });
    }
    catch (err) {
        sendError(res, err);
    }
});
