const express = require('express');
const daasNode = require('../daas/daas');

const router = express.Router();

const db = require("../db/models");
const { where, Op } = require('sequelize');
const DinLocal = db.DinLocal;
const Din = db.Din;
const DinLink = db.DinLink;
const DinHasDin = db.DinHasDin;

const DaasService = require('../services/daas.service');

router.get('/', function (req, res) {
    res.send({
        name: "DaasIoT API",
        version: 0,
        status: "OK",
    })
})

router.post('/start', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        // Esegue init nodo data
        await DaasService.loadConfig(daasNode.getNode());
        // daasNode.doPerform();
        // daasNode.start();
        res.send("Nodo locale avviato.")
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.post('/stop', function (req, res) {
    console.log("[API] /stop Node stopped.");
    // daasNode.doEnd();
    daasNode.stop();
    res.send({})
});

router.post('/send', function (req, res) {
    console.log("[API] /send", req.body);

    try {
        const din = req.body.din;
        const typeset = parseInt(req.body.typeset);
        const payload = req.body.payload || [];

        daasNode.send(din, typeset, JSON.stringify(payload));
        res.send({ message: "OK" });
    } catch (error) {
        res.status(500).send({ error })
    }
});

router.get('/status', function (req, res) {
    // Ritorna lo status di tutti i nodi locali.
    console.log("Node", daasNode.getNode().getStatus());
    res.send(daasNode.getNode().getStatus())
});

router.get('/version', function (req, res) {
    console.log("api:daas:stop", daasNode.getNode().getVersion(0, 0));
    res.send(daasNode.getNode().getVersion(0, 0))
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
        console.error(err);

        res.status(500).send({
            message: err
        })
    }
});

router.put('/config', async function (req, res) {
    const t = await db.sequelize.transaction();

    try {
        const { din, din_id, ...dinLocal } = req.body;
        await DinLocal.update(dinLocal, { where: { id: 1 }, transaction: t });
        await Din.update(din_id, { where: { id: din.id }, transaction: t });

        await t.commit();

        res.send({ message: "DinLocal aggiornato con successo." });
    } catch (err) {
        await t.rollback();
        console.error(err);

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
                message: `Non è stato possibile eliminare il link con id=${id}. Forse il Link non esiste.`
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
});


router.get('/config/dins/', async function (res, res) {
    try {
        data = await Din.findAll({ where: { id: { [Op.ne]: 1 } } });
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err
        })
    }
});

router.get('/config/dins/', async function (res, res) {
    try {
        data = await Din.findAll({ where: { id: { [Op.ne]: 1 } } });
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: err
        })
    }
});

router.post('/config/dins/', async function (req, res) {
    const t = await db.sequelize.transaction();
    const dinLocalId = 1;

    try {
        const obj = await Din.create(req.body);
        await DinHasDin.create({ pdin_id: dinLocalId, cdin_id: obj.id });

        await t.commit();
        res.send(obj);
    } catch (err) {
        await t.rollback();
        console.log(err)
        res.status(500).send({
            message: err
        })
    }
});

router.post('/config/dins/', async function (req, res) {
    const t = await db.sequelize.transaction();
    const dinLocalId = 1;

    try {
        const obj = await Din.create(req.body);
        await DinHasDin.create({ pdin_id: dinLocalId, cdin_id: obj.id });

        await t.commit();
        res.send(obj);
    } catch (err) {
        await t.rollback();
        console.log(err)
        res.status(500).send({
            message: err
        })
    }
});


router.put('/config/dins/:id', async function (req, res) {
    const dinId = req.params.id;
    const { id, din_id, ...rest } = req.body;

    try {
        const updatedRows = await Din.update({ ...rest }, { where: { id: dinId } });

        if (!!updatedRows) {
            res.send({ message: "Din aggiornato con successo." });
        } else {
            res.send({
                message: `Non è stato possibile aggiornare il din con id=${id}. Forse il Link non esiste oppure il body della richiesta è vuoto!`
            });
        }
    } catch (err) {
        res.status(500).send(err)
    }
});

router.delete('/config/dins/:id', async function (req, res) {
    const t = await db.sequelize.transaction();
    const id = req.params.id;

    try {
        await DinHasDin.destroy({ where: { cdin_id: id } });
        const deletedRows = await Din.destroy({ where: { id } });

        if (!!deletedRows) {
            res.send({ message: "Din eliminato." });
        } else {
            res.status(404).send({
                message: `Non è stato possibile eliminare il din con id=${id}. Forse il Link non esiste.`
            });
        }

        await t.commit();

        res.send(obj);
    } catch (err) {
        await t.rollback();
        console.log(err)
        res.status(500).send({
            message: err
        })
    }
});




module.exports = router;