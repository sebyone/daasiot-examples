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
        message: "OK",
    });
});


router.post('/configure', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        await DaasService.loadConfig(daasNode.getNode());
        res.send({ message: "Applicata configurazione." })
    } catch (error) {
        sendError(res, err);
    }
})

router.post('/stop', function (req, res) {
    console.log("[API] /stop Node stopped.");
    try {
        const isStopped = daasNode.getNode().doPerform();
        
        console.log("isStopped", isStopped);

        res.send({ message: "Nodo stoppato." });
    } catch (error) {
        sendError(res, err);
    }
});

router.post('/start', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        // Esegue init nodo data
        await DaasService.loadConfig(daasNode.getNode());
        // daasNode.doPerform();
        // daasNode.start();
        res.send({ message: "Nodo locale avviato."});
    } catch (error) {
        sendError(res, err);
    }
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
        sendError(res, err);
    }
});

router.get('/status', function (req, res) {
    // Ritorna lo status di tutti i nodi locali.
    console.log("Node", daasNode.getNode().getStatus());
    res.send(daasNode.getNode().getStatus())
});

router.get('/version', function (req, res) {

    // TODO: Cambiare con la versione aggiornata
    // const version = daasNode.getNode().getVersion(0, 0)
    
    const version = {
        "daasLibraryVersion": "0.7.0",
        "nodeGypVersion": "^10.1.0",
        "compilerVersion": "GCC 11.4.0",
        "standardLibraryVersion": "GNU libstdc++ 20230528"
    }
    
    res.send(version);
});


// Local node
router.get('/config', async function (req, res) {
    try {
        data = await DinLocal.findByPk(1, { include: ['din'] });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/config', async function (req, res) {
    const t = await db.sequelize.transaction();

    try {
        const { din, ...dinLocal } = req.body;
        await DinLocal.update(dinLocal, { where: { id: 1 }, transaction: t });
        await Din.update(din, { where: { id: din.id }, transaction: t });

        await t.commit();

        updatedData = await DinLocal.findByPk(1, { include: ['din'] });
        res.send(updatedData);
    } catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});

router.put('/config', async function (req, res) {
    const t = await db.sequelize.transaction();

    console.log(`PUT /config (req.body)`, req.body);
    try {
        const { din, din_id, ...dinLocal } = req.body;

        if (!din_id) {
            throw new Error("Il campo din_id è obbligatorio.");
        }
        else if (!din) {
            throw new Error("Il campo din è obbligatorio.");
        }
                
        await DinLocal.update(dinLocal, { where: { id: 1 }, transaction: t });
        await Din.update({ id: din_id, ...din }, { where: { id: din_id }, transaction: t });

        await t.commit();

        res.send({ message: "DinLocal aggiornato con successo." });
    } catch (err) {
        await t.rollback();
        sendError(res, err);
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
        sendError(res, err);
    }
});

router.get('/config/links/:id', async function (req, res) {
    const linkId = req.params.id;

    try {
        data = await DinLink.findByPk(linkId);

        if (!data) {
            sendError(res, new Error(`Link con id=${linkId} non trovato.`), 404);
        }
        else {
            res.send(data);
        }
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/config/links', async function (req, res) {
    try {
        if (!req.body.url) {
            throw new Error("Il campo URL è obbligatorio.");
        }
        if (!req.body.link) {
            throw new Error("Il campo Link è obbligatorio.");
        }
        // check that req.body.link is 1, 2, 3 or 4
        if (![1, 2, 3, 4].includes(req.body.link)) {
            throw new Error("Il campo Link deve essere 1, 2, 3 o 4.");
        }

        const dinLink = await DinLink.update({ din_id: 1, ...req.body }, { where: { id: 1 } });

        res.send(dinLink);
    } catch (err) {
        sendError(res, err);
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
            res.status(400).send({
                message: `Non è stato possibile aggiornare il link con id=${id}. Forse il Link non esiste oppure il body della richiesta è vuoto!`
            });
        }
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/config/links/:id', async function (req, res) {
    const id = req.params.id;
    try {
        const deletedRows = await DinLink.destroy({ where: { id } });

        if (!!deletedRows) {
            res.send({ message: "Link eliminato con successo." });
        } else {
            res.status(404).send({
                message: `Non è stato possibile eliminare il link con id=${id}. Forse il Link non esiste.`
            });
        }
    } catch (err) {
        sendError(res, err);
    }
});


router.get('/config/dins/', async function (res, res) {
    try {
        data = await Din.findAll({ where: { id: { [Op.ne]: 1 } } });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/config/dins/:id', async function (req, res) {
    const dinId = req.params.id;

    try {
        data = await Din.findByPk(dinId);

        if (!data) {
            sendError(res, new Error(`Din con id=${dinId} non trovato.`), 404);
        }
        else {
            res.send(data);
        }
    } catch (err) {
        sendError(res, err);
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
        sendError(res, err);
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
        sendError(res, err);
    }
});


router.put('/config/dins/:id', async function (req, res) {
    const dinId = req.params.id;
    const { id, din_id, ...rest } = req.body;
    
    try {
        if (!dinId) {
            throw new Error("Il campo din_id è obbligatorio.");
        }

        // se il din non esiste, lancio un errore
        const din = await Din.findByPk(dinId);
        if (!din) {
            throw new Error(`Din con id=${dinId} non trovato.`);
        }

        
        const updatedRows = await Din.update({ ...rest }, { where: { id: dinId } })

        if (!!updatedRows) {
            res.send({ message: "Din aggiornato con successo." });
        } else {
            res.status(400).send({
                message: `Non è stato possibile aggiornare il din con id=${id}. Forse il Link non esiste oppure il body della richiesta è vuoto!`
            });
        }
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/config/dins/:id', async function (req, res) {
    const id = req.params.id;

    try {
        await DinHasDin.destroy({ where: { cdin_id: id } });
        const deletedRows = await Din.destroy({ where: { id } });

        if (!!deletedRows) {
            res.send({ message: "Din eliminato con successo." });
        } else {
            res.status(404).send({
                message: `Non è stato possibile eliminare il din con id=${id}. Forse il Link non esiste.`
            });
        }
    } catch (err) {
        sendError(res, err);
    }
});


function sendError(res, error, status = 500) {
    console.error(error);

    res.status(status).send({
        error_type: error.name,
        message: error.message,
    })
}

module.exports = router;
