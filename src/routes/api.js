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

// 
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
        throw new Error("Not ancora implementato.");
    } catch (error) {
        sendError(res, error);
    }
});

router.post('/send', async function (req, res) {
    console.log("[API] /send body:", req.body);
    

    try {
        const din = parseInt(req.body.din);
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
        const data = await DinLocal.findAll({ include: ['din'] });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/receivers/:receiverId', async function (req, res) {
    try {
        const receiverId = parseInt(req.params.receiverId);
        const data = await DinLocal.findByPk(receiverId, { include: ['din'] });
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

        if (!din) {
            res.status(400);
            throw new Error("l'oggetto din è obbligatorio.");
        }
        
        const requiredFields = ['sid', 'din', 'p_res', 'skey'];
        for (const field of requiredFields) {
            if (!din[field]) {
                res.status(400);
                throw new Error(`Il campo din.${field} è obbligatorio.`);
            }
        }
        
        if (!dinLocal.title) {
            res.status(400);
            throw new Error("Il campo title è obbligatorio.");
        }

        const newDin = await Din.create(din, { transaction: t });
        const newDinLocal = await DinLocal.create({ din_id: newDin.id, ...dinLocal }, { transaction: t });

        await t.commit();

        const data = await DinLocal.findByPk(newDinLocal.id, { include: ['din'] });
        res.send(data);
        
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


router.delete('/receivers/:receiverId', async function (req, res) {
    const receiverId = parseInt(req.params.receiverId);
    try {
        const deletedRows = await DinLocal.destroy({ where: { id: receiverId } });

        if (deletedRows == 0) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        
        res.send({ message: "Receiver eliminato con successo." });
    } catch (err) {
        sendError(res, err);
    }
});


//#region Receivers links

router.get('/receivers/:receiverId/links', async function (req, res) {
    try {
        const receiverId = parseInt(req.params.receiverId);
        const data = await DinLink.findAll({ where: { din_id: receiverId } });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/receivers/:receiverId/links/:id', async function (req, res) {
    
    try {
        const linkId = parseInt(req.params.id);
        const receiverId = parseInt(req.params.receiverId);

        const data = await DinLink.findByPk(linkId);
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


//#region Receivers dins


// TODO: DA IMPLEMENTARE TUTTI USANDO /receivers/:receiverId/dins/



// restituisce tutti i dins
router.get('/dins/', async function (res, res) {
    try {
        const data = await Din.findAll();
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

// restituisce tutti i dins associati ad un qualsiasi receiver
router.get('/receivers/any/dins/', async function (res, res) {
    try {
        const allReceivers = await DinLocal.findAll();
        const allReceiversDinsIds = allReceivers.map(r => r.din_id);

        const allReceiversDins = await Din.findAll({
            where: {
                id: {
                    [Op.in]: allReceiversDinsIds
                }
            }
        });
        
        res.send(allReceiversDins);
    } catch (err) {
        sendError(res, err);
    }
});



// Restituisce i nodi mappati sul receiver (id=receiverId)
router.get('/receivers/:receiverId/remotes', async function (req, res) {
    const receiverId = parseInt(req.params.receiverId);

    try {
        const receiver = await DinLocal.findByPk(receiverId);
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        const mappedDins = await DinHasDin.findAll({ where: { pdin_id: receiverId }, include: ['cdin'] });
    
        res.send(mappedDins);
    } catch (err) {
        sendError(res, err);
    }
});

// Restituisce il nodo (id=id) del receiver (id=receiverId)
router.get('/receivers/:receiverId/remotes/:id', async function (req, res) {
    const receiverId = parseInt(req.params.receiverId);
    const dinId = parseInt(req.params.id);

    try {

        const receiver = await DinLocal.findByPk(receiverId);
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        
        const mappedDin = await DinHasDin.findOne({ where: { pdin_id: receiverId, cdin_id: dinId }, include: ['cdin'] });
        
        if (mappedDin === null) {
            res.status(404);
            throw new Error(`Non è stato trovato un nodo mappato con id=${dinId} dal receiver con id=${receiverId}.`);
        }

        res.send(mappedDin);
    } catch (err) {
        sendError(res, err);
    }
});


/**
 * Associa o crea (map) un nodo remoto al receiver (id=receiverId)
 * Se il node non esiste nella tabella Din, lo crea e poi lo associa.
 * 
 * @example curl -X POST -H "Content-Type: application/json" -d '{"din": {"sid": "100", "din": "87", "p_res": "000", "skey": "9efbaeb2a94f"}, "link": {"link": 2, "url": "127.0.0.1:3087"}}' http://localhost:3000/api/receivers/1/remotes/
 * 
 */
router.post('/receivers/:receiverId/remotes/', async function (req, res) {
    const t = await db.sequelize.transaction();
    const receiverId = parseInt(req.params.receiverId);
    
    try {
        const receiver = await DinLocal.findByPk(receiverId, { include: ['din'] });
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const { din, link } = req.body;

        if (!din) {
            res.status(400);
            throw new Error("l'oggetto din è obbligatorio.");
        }

        let remoteDin = null;

        if (!din.id) {
            // se non è stato passato l'id del din, lo creo
            const requiredFields = ['sid', 'din', 'p_res', 'skey'];
            for (const field of requiredFields) {
                if (!din[field]) {
                    res.status(400);
                    throw new Error(`Non è stato possibile creare un nodo remoto, il campo din.${field} è obbligatorio`);
                }
            }

            remoteDin = await Din.create(din, { transaction: t });
        }
        else {
            // se è stato passato l'id del din fai un update e poi lo associ
            remoteDin = await Din.findByPk(din.id);
            if (remoteDin === null) {
                res.status(404);
                throw new Error(`Din con id=${din.id} non trovato.`);
            }
            await Din.update(din, { where: { id: din.id }, transaction: t });
        }


        if(!remoteDin) {
            res.status(400);
            throw new Error("Non è stato possibile creare un nodo remoto.");
        }

        if (remoteDin.id === receiver.din_id) {
            res.status(400);
            throw new Error("Non è possibile mappare un nodo remoto a se stesso.");
        }

        // se è stato passato il link, lo aggiungo
        let linkId = null;
        if (link && link.link && link.url ) {
            if (![1, 2, 3, 4].includes(link.link)) {
                res.status(400);
                throw new Error("Il campo link.link deve essere 1, 2, 3 o 4.");
            }

            linkId = parseInt(link.id);
            if (linkId) {
                // se è stato passato l'id del link fai un update
                const oldLink = await DinLink.findByPk(linkId);
                if (oldLink === null) {
                    res.status(404);
                    throw new Error(`Link con id=${linkId} non trovato.`);
                }
                if (oldLink.din_id !== remoteDin.id) {
                    res.status(403);
                    throw new Error(`Il link con id=${linkId} non appartiene al nodo remoto con id=${remoteDin.id}.`);
                }

                const updatedRows = await DinLink.update({ link: link.link, url: link.url }, { where: { id: link.id }, transaction: t });
                
                if (!updatedRows) {
                    res.status(404);
                    throw new Error(`Link con id=${link.id} non trovato.`);
                }
            }
            else {
                // se non è stato passato l'id del link, lo creo
                await DinLink.create({ din_id: remoteDin.id, ...link }, { transaction: t });
            }
        }

        const mappedDin = await DinHasDin.create({ pdin_id: receiverId, cdin_id: remoteDin.id }, {include: ['cdin'], transaction: t});


        await t.commit();
        
        // daasNode.getNode().map(mappedDin['cdin.din']);

        res.send(mappedDin);
    } catch (err) {
        sendError(res, err);
        await t.rollback();
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
    const dinId = parseInt(req.params.id);
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


/**
 * Elimina l’associazione (map) tra il nodo remoto e il receivers
 * Se, eliminando questa associazione, il nodo remoto non ha più associazioni, il nodo viene cancellato
 */
router.delete('/receivers/:receiverId/remotes/:id', async function (req, res) {
    const id = parseInt(req.params.id);
    const receiverId = parseInt(req.params.receiverId);

    // TODO: controllare quando si elimina un din se ci sia un local_din associato

    try {

        const receiver = await DinLocal.findByPk(receiverId);
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const dinToDelete = await DinHasDin.findOne({ where: { pdin_id: receiver.din_id, cdin_id: id } });
        if (dinToDelete === null) {
            res.status(404);
            throw new Error(`Non è stato trovato un nodo mappato con id=${id} dal receiver con id=${receiverId}.`);
        }

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

/**
 *  Elimina tutte le associazioni (map) tra il receiver e i nodi remoti
 * I nodi remoti, che restano senza associazione, vengono cancellati.
 */
router.delete('/receivers/:receiverId/remotes', async function (req, res) {
    // TODO: IMPLEMENT
    sendError(res, new Error("Not yet implemented."), 501);
});


function sendError(res, error, status) {
    
    // 200 è lo stato di default, se non è stato impostato uno stato custom usa quello passato alla funzione
    if (res.statusCode === 200) {
        res.status(status || 500 );
    }
    res.send({
        error_name: error.name,
        message: error.message,
    })
    console.error(`[daas] ${error.name} code ${res.statusCode}: ${error.message}`);
}

module.exports = router;
