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
        sendError(res, error);
    }
})

router.post('/stop', function (req, res) {
    console.log("[API] /stop Node stopped.");
    try {
        const isStopped = daasNode.stop();
        
        if (!isStopped) {
            throw new Error("Impossibile fermare il nodo.");
        }
        console.log("isStopped", isStopped);

        res.send({ message: "Nodo stoppato." });
    } catch (error) {
        sendError(res, error);
    }
});

router.post('/start', async function (req, res) {
    console.log("[API] /start Node started.");
    try {
        // Esegue init nodo data
        await DaasService.loadConfig(daasNode.getNode());

        daasNode.start();
        res.send({ message: "Nodo locale avviato."});
    } catch (error) {
        sendError(res, error);
    }
});

router.post('/restart', async function (req, res) {
    console.log("[API] /restart Node restarted.");
    try {
        // TODO: IMPLEMENT
        throw new Error("Not implemented yet.");
    } catch (error) {
        sendError(res, error);
    }
});

router.post('/send', function (req, res) {
    console.log("[API] /send", req.body);

    try {
        const din = req.body.din;
        const typeset = parseInt(req.body.typeset);
        const payload = req.body.payload || [];

        daasNode.send(din, typeset, JSON.stringify(payload));
        res.send({ message: "Messaggio inviato" });
    } catch (error) {
        sendError(res, error);
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


//#region Receivers

/**
 * Ritorna una lista di tutti i receivers.
 */
router.get('/receivers', async function (req, res) {
    try {
        data = await DinLocal.findAll({ include: ['din'] });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/receivers/:receiverId', async function (req, res) {
    try {
        const receiverId = req.params.receiverId;
        data = await DinLocal.findByPk(receiverId, { include: ['din'] });
        if (!data) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

/**
 * Agguinge un nuovo receiver
 */
router.post('/receivers', async function (req, res) {
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

router.put('/receivers/:receiverId', async function (req, res) {
    const t = await db.sequelize.transaction();
    
    console.log(`PUT /config (req.body)`, req.body);
    try {
        const receiverId = parseInt(req.params.receiverId);

        const { din, ...dinLocal } = req.body;

        if (!din) {
            res.status(400);
            throw new Error("Il campo din è obbligatorio.");
        }

        const oldDinLocal = await DinLocal.findByPk(receiverId);
        if (!oldDinLocal) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const oldDin = await Din.findByPk(oldDinLocal.din_id);
        if (!oldDin) {
            res.status(404);
            throw new Error(`Din con id=${oldDinLocal.din_id} non trovato.`);
        }



        await DinLocal.update(dinLocal, { where: { id: receiverId }, transaction: t });
        await Din.update({ id: din_id, ...din }, { where: { id: din_id }, transaction: t });

        await t.commit();

        res.send({ message: "DinLocal aggiornato con successo." });
    } catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});


//#region Receivers links


router.get('/receivers/:receiverId/links', async function (req, res) {
    try {
        const receiverId = req.params.receiverId;
        data = await DinLink.findAll({ where: { din_id: receiverId } });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/receivers/:receiverId/links/:id', async function (req, res) {
    
    try {
        const linkId = parseInt(req.params.id);
        const receiverId = parseInt(req.params.receiverId);

        data = await DinLink.findByPk(linkId);
        if (data === null) {
            res.status(404);
            throw new Error(`Link con id=${linkId} non trovato.`);
        }
        
        const dinLocal = await DinLocal.findByPk(data.din_id);
        if (dinLocal === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        if (data.din_id !== dinLocal.din_id) {
            res.status(403);
            throw new Error(`Link con id=${linkId} non appartiene al receiver con id=${receiverId}.`);
        }
        
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/receivers/:receiverId/links', async function (req, res) {
    try {
        const receiverId = parseInt(req.params.receiverId);

        if (!req.body.url) {
            res.status(400);
            throw new Error("Il campo URL è obbligatorio.");
        }
        if (!req.body.link) {
            res.status(400);
            throw new Error("Il campo Link è obbligatorio.");
        }
        // check that req.body.link is 1, 2, 3 or 4
        if (![1, 2, 3, 4].includes(req.body.link)) {
            res.status(400);
            throw new Error("Il campo Link deve essere 1, 2, 3 o 4.");
        }
        
        const dinLocal = await DinLocal.findByPk(receiverId);

        if (dinLocal === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const dinLink = await DinLink.create({ din_id: dinLocal.din_id, ...req.body });

        res.send(dinLink);
    } catch (err) {
        sendError(res, err);
    }
});

router.put('/receivers/:receiverId/links/:id', async function (req, res) {
    const linkId = parseInt(req.params.id);
    const receiverId = parseInt(req.params.receiverId);
    const { id, din_id, ...rest } = req.body;
    try {
        const dinLocal = await DinLocal.findByPk(receiverId);
        const oldLink = await DinLink.findByPk(linkId);

        if (oldLink == null) {
            res.status(404);
            throw new Error(`Link con id=${linkId} non trovato.`);
        }

        if (dinLocal === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        if (oldLink.din_id !== dinLocal.din_id) {
            res.status(403);
            throw new Error(`Link con id=${linkId} non appartiene al receiver con id=${receiverId}.`);
        }

        const updatedRows = await DinLink.update({ ...rest, din_id: dinLocal.din_id }, { where: { id: linkId } });

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

router.delete('/receivers/:receiverId/links/:id', async function (req, res) {
    const id = parseInt(req.params.id);
    const receiverId = parseInt(req.params.receiverId);
    try {
        const dinLocal = await DinLocal.findByPk(receiverId);
        const link = await DinLink.findByPk(id);
        
        if (link === null) {
            res.status(404);
            throw new Error(`Link con id=${id} non trovato.`);
        }
        if (dinLocal === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        if (link.din_id !== dinLocal.din_id) {
            res.status(403);
            throw new Error(`Link con id=${id} non appartiene al receiver con id=${receiverId}.`);
        }

        const deletedRows = await DinLink.destroy({ where: { id: id } });

        if (deletedRows == 0) {
            res.status(404)
            throw new Error(`Link con id=${id} non trovato.`);
        }
            
        res.send({ message: "Link eliminato con successo." });
    } catch (err) {
        sendError(res, err);
    }
});


//#region Receivers links


// TODO: DA IMPLEMENTARE TUTTI USANDO /receivers/:receiverId/dins/


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

//#region Receivers Map



function sendError(res, error, status) {
    console.error(error);

    // 200 è lo stato di default, se non è stato impostato uno stato custom usa quello passato alla funzione
    if (res.statusCode === 200) {
        res.status(status || 500 );
    }
    res.send({
        error_name: error.name,
        message: error.message,
    })
}

module.exports = router;
