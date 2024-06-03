const express = require('express');
// const daasNode = require('../daas');
// const daasNodeSdk = require('../daas/daas');
const daasNode = require('../daas/daas');

const router = express.Router();

router.get('/', function (req, res) {
    res.send({
        name: "DaasIoT API",
        version: 0,
        status: "OK",
    })
})

router.post('/configure', function (req, res, next) {
    console.log("[API] /configure Node configure.");
    res.send({})
})

router.post('/start', function (req, res) {
    console.log("[API] /start Node started.");
    // daasNode.doPerform();
    daasNode.start();
    res.send({})
})

router.post('/stop', function (req, res) {
    console.log("[API] /stop Node stopped.");
    // daasNode.doEnd();
    daasNode.stop();
    res.send({})
});

router.post('/send', function (req, res) {
    console.log("[API] /send", req.body);

    const din = req.body?.din;
    const payload = req.body?.payload ?? {};

    daasNode.send(din, 10, JSON.stringify(payload));

    // const located = daasNode.locate(din);
    // console.log(`[API] /send 🔍 Locate ${din}: ${located}`);

    // if (located) {
    //     let timestamp = new Date().getTime();

    //     daasNode.push(din, 10, timestamp, JSON.stringify(payload));
    //     console.log(`[API] /send ⬆⬆ Pushing data to ${din} done.`);
    // }

    res.send({})
});

router.get('/status', function (req, res) {
    console.log("Node", daasNode.getStatus());
    res.send(daasNode.getStatus())
});

router.get('/version', function (req, res) {
    console.log("api:daas:stop", daasNode.getVersion(0, 0));
    res.send({})
});


module.exports = router;