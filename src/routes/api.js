const express = require('express');
const daasNode = require('../daas/daas');

const router = express.Router();

const db = require("../db/models");
const { where, Op } = require('sequelize');
const DinLocal = db.DinLocal;
const Din = db.Din;
const DinLink = db.DinLink;

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


// Local node
router.get('/config', async function (req, res) {
    try {
        data = await DinLocal.findByPk(1, { include: ['din'] });
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
});

router.post('/config', async function (req, res) {
    const t = await db.sequelize.transaction();

    try {
        const { din, ...dinLocal } = req.body;
        await DinLocal.update(dinLocal, { where: { id: 1 } });
        await Din.update(din, { where: { id: din.id }, transaction: t });

        await t.commit();

        updatedData = await DinLocal.findByPk(1, { include: ['din'] });
        res.send(updatedData);
    } catch (err) {
        await t.rollback();
        console.log(err)
        res.status(500).send({
            message: err
        })
    }
});

router.get('/config/links', async function (req, res) {
    try {
        data = await DinLink.findAll({
            where: {
                din_id: {
                    [Op.eq]: 1
                }
            }
        });
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err
        })
    }
});

router.get('/config/links/:id', async function (req, res) {
    const linkId = req.params.id;

    try {
        data = await DinLink.findByPk(linkId);
        res.send(data);
    } catch (err) {
        res.status(500).send({
            message: err
        })
    }
});

router.post('/config/links', async function (req, res) {
    try {
        const dinLink = await DinLink.update({ din_id: 1, ...req.body }, { where: { id: id } });

        res.send(dinLink);
    } catch (err) {
        res.status(500).send(err)
    }
});

router.put('/config/links/:id', async function (req, res) {
    const linkId = req.params.id;
    const { id, din_id, ...rest } = req.body;
    try {
        const updatedRows = await DinLink.update({ ...rest, din_id: 1 }, { where: { id: linkId } });

        if (!!updatedRows) {
            res.send({ message: "Link aggiornato con successo." });
        } else {
            res.send({
                message: `Non è stato possibile aggiornare il link con id=${id}. Forse il Link non esiste oppure il body della richiesta è vuoto!`
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
});

router.delete('/config/links/:id', async function (req, res) {
    const id = req.params.id;
    try {
        const deletedRows = await DinLink.destroy({ where: { id } });

        if (!!deletedRows) {
            res.send({ message: "Link eliminato." });
        } else {
            res.status(404).send({
                message: `Non è stato possibile aggiornare il link con id=${id}. Forse il Link non esiste.`
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
});



module.exports = router;