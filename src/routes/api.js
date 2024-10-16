/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: api.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * vincenzo.petrungaro@gmail.com - initial implementation
 * alessio.farfaglia@gmail.com - rewrite and documentation
 *
 */

const express = require('express');
const daasNode = require('../daas/daas');

const router = express.Router();

const db = require("../db/models");
const { Op } = require('sequelize');
const DinLocal = db.DinLocal;
const Din = db.Din;
const DinLink = db.DinLink;
const DinHasDin = db.DinHasDin;
const Device = db.Device;
const DeviceModel = db.DeviceModel;
const DeviceModelGroup = db.DeviceModelGroup;
const DDO = db.DDO;

const DaasService = require('../services/daas.service');
const { createDDO } = require('../services/ddo.service');

const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT = 50;

//#region Config and Lifecycle

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
        const ddo = await createDDO(101, din, payload, timestampSeconds, typeset);
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
        const force =  req.body.force || false;
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

//#endregion

//#region Receivers

/**
 * Ritorna una lista di tutti i receivers.
 */
router.get('/receivers', async function (req, res) {
    try {
        const data = await DinLocal.findAll({ include: ['din', 'links', 'device'] });
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});


router.get('/receivers/count', async function (req, res) {
    try {
        const count = await DinLocal.count();
        res.send({ count });
    } catch (err) {
        sendError(res, err);
    }
});


router.get('/receivers/:receiverId', async function (req, res) {
    try {
        const receiverId = parseInt(req.params.receiverId);
        const data = await DinLocal.findByPk(receiverId, { include: ['din', 'links', 'device'] });
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
 * 
 * @example curl -X POST -H "Content-Type: application/json" -d '{"din": {"sid": "100", "din": "87", "p_res": "000", "skey": "9efbaeb2a94f"}, "title": "Receiver 1"}' http://localhost:3000/api/receivers/
 */
router.post('/receivers', async function (req, res) {
    const t = await db.sequelize.transaction();

    try {
        const { din, links, ...dinLocal } = req.body;

        if (!din) {
            res.status(400);
            throw new Error("l'oggetto din è obbligatorio.");
        }

        const requiredFields = ['sid', 'din'];
        for (const field of requiredFields) {
            if (din[field] == undefined) {
                res.status(400);
                throw new Error(`Il campo din.${field} è obbligatorio.`);
            }
        }

        if (!dinLocal.title) {
            res.status(400);
            throw new Error("Il campo title è obbligatorio.");
        }


        if (links) {
            res.status(400);
            throw new Error("Non è possibile aggiungere i link durante la creazione del receiver, usa l'endpoint /receivers/:receiverId/links");
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

        const { din, links, ...dinLocal } = req.body;

        if (!din) {
            res.status(400);
            throw new Error("Il campo din è obbligatorio.");
        }

        if (links) {
            res.status(400);
            throw new Error("Non è possibile aggiungere i link durante la creazione del receiver, usa l'endpoint /api/receivers/:receiverId/links");
        }

        const oldDinLocal = await DinLocal.findByPk(receiverId, { transaction: t });
        if (!oldDinLocal) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const oldDin = await Din.findByPk(oldDinLocal.din_id, { transaction: t });
        if (!oldDin) {
            res.status(404);
            throw new Error(`Din con id=${oldDinLocal.din_id} non trovato.`);
        }

        await DinLocal.update(dinLocal, { where: { id: receiverId }, transaction: t });
        await Din.update({ id: oldDinLocal.din_id, ...din }, { where: { id: oldDinLocal.din_id }, transaction: t });

        await t.commit();

        res.send({ message: "DinLocal aggiornato con successo." });
    } catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});


router.delete('/receivers/:receiverId', async function (req, res) {
    const receiverId = parseInt(req.params.receiverId);
    const t = await db.sequelize.transaction();

    try {
        const receiver = await DinLocal.findByPk(receiverId, { transaction: t });

        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const mappedDins = await DinHasDin.findAll({ where: { pdin_id: receiver.din_id }, transaction: t });
        if (mappedDins.length > 0) {
            res.status(409);
            const mappedDinsIds = mappedDins.map(m => m.cdin_id);
            throw new Error(`Non è possibile eliminare il receiver con id=${receiverId} perché ha nodi remoti mappati: ${mappedDinsIds.join(', ')}.`);
        }

        const deletedDinLocalRows = await DinLocal.destroy({ where: { id: receiverId }, transaction: t });
        const deletedDinRows = await Din.destroy({ where: { id: receiver.din_id }, transaction: t });

        if (deletedDinLocalRows == 0 || deletedDinRows == 0) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        await t.commit();

        res.send({ message: "Receiver eliminato con successo." });
    } catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});


//#endregion

//#region Receivers links

router.get('/receivers/:receiverId/links', async function (req, res) {
    try {
        const receiverId = parseInt(req.params.receiverId);
        const receiver = await DinLocal.findByPk(receiverId, { include: ['links'] });
        res.send(receiver.links);
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
            throw new Error("Il campo url è obbligatorio.");
        }
        if (!req.body.link) {
            res.status(400);
            throw new Error("Il campo link è obbligatorio.");
        }
        // check that req.body.link is 1, 2, 3 or 4
        const link = parseInt(req.body.link);
        if (![1, 2, 3, 4].includes(link)) {
            res.status(400);
            throw new Error(`Il campo link deve essere 1, 2, 3 o 4, invece è ${req.body.link}.`);
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

        if (!updatedRows) {
            res.status(404);
            throw new Error(`Link con id=${linkId} non trovato.`);
        }

        res.send({ message: "Link aggiornato con successo." });
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

        const deletedRows = await DinLink.destroy({ where: { id: id }, force: true });

        if (deletedRows == 0) {
            res.status(404)
            throw new Error(`Link con id=${id} non trovato.`);
        }

        res.send({ message: "Link eliminato con successo." });
    } catch (err) {
        sendError(res, err);
    }
});

//#endregion

//#region DINs


// restituisce tutti i dins e i link associat (se il parametro links è diverso da false)
router.get('/dins/', async function (req, res) {
    try {
        const data = await Din.findAll();
        res.send(data);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/remotes/', async function (req, res) {
    try {
        const allReceivers = await DinLocal.findAll();
        const allReceiversDinsIds = allReceivers.map(r => r.din_id);

        const allRemotesDins = await Din.findAll({
            where: {
                id: {
                    // NOT IN -> troviamo tutti i dins non hanno associato un receiver e quindi sono remote
                    [Op.notIn]: allReceiversDinsIds
                }
            },
            include: ['links']
        });

        res.send(allRemotesDins);
    } catch (err) {
        sendError(res, err);
    }
});


router.get('/remotes/count', async function (req, res) {
    try {
        const allReceivers = await DinLocal.findAll();
        const allReceiversDinsIds = allReceivers.map(r => r.din_id);

        const count = await Din.count({
            where: {
                id: {
                    // NOT IN -> troviamo tutti i dins non hanno associato un receiver e quindi sono remote
                    [Op.notIn]: allReceiversDinsIds
                }
            }
        });

        res.send({ count });
    } catch (err) {
        sendError(res, err);
    }
});

//#endregion

//#region Receivers remotes

// Restituisce i nodi mappati sul receiver (id=receiverId)
router.get('/receivers/:receiverId/remotes', async function (req, res) {
    const receiverId = parseInt(req.params.receiverId);

    try {
        const receiver = await DinLocal.findByPk(receiverId);
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }
        const mappedDins = await DinHasDin.findAll({ where: { pdin_id: receiver.din_id }, include: ['cdin'] });

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

        const mappedDin = await DinHasDin.findOne({ where: { pdin_id: receiver.din_id, cdin_id: dinId }, include: ['cdin'] });

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
 * @example curl -X POST -H "Content-Type: application/json" -d '{"din": {"sid": "100", "din": "87", "p_res": "000", "skey": "9efbaeb2a94f"}}' http://localhost:3000/api/receivers/1/remotes/
 * 
 * @example curl -X POST -H "Content-Type: application/json" -d '{"din": {"id": "2"}}' http://localhost:3000/api/receivers/1/remotes/
 * 
 */
router.post('/receivers/:receiverId/remotes/', async function (req, res) {
    const t = await db.sequelize.transaction();
    const receiverId = parseInt(req.params.receiverId);
    let remoteDin = null;
    try {
        const receiver = await DinLocal.findByPk(receiverId, { include: ['din'] });
        if (receiver === null) {
            res.status(404);
            throw new Error(`Receiver con id=${receiverId} non trovato.`);
        }

        const { din } = req.body;

        if (!din) {
            res.status(400);
            throw new Error("l'oggetto din è obbligatorio.");
        }

        if (!din.id) {
            // se non è stato passato l'id del din, lo creo
            const requiredFields = ['sid', 'din'];
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

        if (!remoteDin) {
            res.status(400);
            throw new Error("Non è stato possibile creare un nodo remoto.");
        }

        if (remoteDin.id === receiver.din_id) {
            res.status(400);
            throw new Error("Non è possibile mappare un nodo remoto a se stesso.");
        }

        /*
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
        */



        // does the receiver already have the remote din mapped?
        let mappedDin = await DinHasDin.findOne({
            where: {
                pdin_id: receiver.din_id,
                cdin_id: remoteDin.id
            },
            transaction: t,
            include: ['cdin']
        });


        if (mappedDin === null) {
            console.log(`[API] receiver (id ${receiver.id}, din_id ${receiver.din_id}) ${receiver.din.din} Mapping remote din (id ${remoteDin.id}) ${remoteDin.din} to `);

            mappedDin = await DinHasDin.create({
                pdin_id: receiver.din_id,
                cdin_id: remoteDin.id
            }, { transaction: t, include: ['cdin'] });
        }

        await t.commit();

        res.send(mappedDin);
    } catch (err) {
        await t.rollback();
        sendError(res, err);
    }

    if (remoteDin && parseInt(remoteDin.din)) {
        daasNode.getNode().map(parseInt(remoteDin.din));
        console.log(`[API] Mapped remote din ${remoteDin.din}`);
    }

});



/**
 * Elimina l’associazione (map) tra il nodo remoto e il receivers
 * Se, eliminando questa associazione, il nodo remoto non ha più associazioni, il nodo viene cancellato
 */
router.delete('/receivers/:receiverId/remotes/:id', async function (req, res) {
    const id = parseInt(req.params.id);
    const receiverId = parseInt(req.params.receiverId);

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

        const deletedMaps = await DinHasDin.destroy({ where: { pdin_id: receiver.din_id, cdin_id: id } });
        console.log(`[API] deletedMaps`, deletedMaps);

        if (deletedMaps == 0) {
            res.status(404)
            throw new Error(`Non è stato trovato un nodo remoto con id=${id}.`);
        }

        // get the number of receivers that have the remote din mapped
        const receiversWithRemoteDinMapped = await DinHasDin.count({ where: { cdin_id: id } });
        console.log(`[API] receiversWithRemoteDinMapped`, receiversWithRemoteDinMapped);

        // if the remote din is not mapped to any receiver, delete it
        if (receiversWithRemoteDinMapped === 0) {
            const deletedDins = await Din.destroy({ where: { id }, cascade: true });
            console.log(`[API] deletedDins`, deletedDins);

            if (deletedDins === 0) {
                res.status(404)
                throw new Error(`Non è stato trovato un nodo remoto con id=${id}.`);
            }
        }

        res.send({ message: "Din eliminato con successo." });
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

//#endregion

//#region Devices

router.get('/devices', async function (req, res) {
    try {
        const { limit, offset } = getPaginationParams(req);
        const q = getQuery(req);
        const where = q ? { name: { [Op.like]: `%${q}%` } } : {};
        const rowsAndCount = await Device.findAndCountAll({ where, limit, offset, include: ['device_model', 'din'] });

        res.send(addQuery(toPaginationData(rowsAndCount, limit, offset), q));

    } catch (err) {
        sendError(res, err);
    }
});

router.get('/devices/:id', async function (req, res) {
    try {
        const id = parseInt(req.params.id);

        const device = await Device.findByPk(id, { include: ['device_model', 'din'] });
        
        if (device === null) {
            res.status(404);
            throw new Error(`Dispositivo con id=${id} non trovato.`);
        }
        res.send(device);
    }
    catch (err) {
        sendError(res, err);
    }
});

router.post('/devices', async function (req, res) {
    try {
        const device = req.body;

        for (const field of ['device_model_id', 'din_id', 'name']) {
            if (!device[field]) {
                res.status(400);
                throw new Error(`Il campo ${field} è obbligatorio.`);
            }
        }

        const din = await Din.findByPk(parseInt(device.din_id));
        if (din === null) {
            res.status(404);
            throw new Error(`Din con id=${device.din_id} non trovato.`);
        }

        const deviceModel = await DeviceModel.findByPk(parseInt(device.device_model_id));
        if (deviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${device.device_model_id} non trovato.`);
        }

        const newDevice = await Device.create(device);
        res.send(newDevice);
    }
    catch (err) {
        sendError(res, err);
    }
});


router.put('/devices/:id', async function (req, res) {
    const t = await db.sequelize.transaction();
    
    try {
        const id = parseInt(req.params.id);
        const device = req.body;

        const oldDevice = await Device.findByPk(id, { transaction: t });
        if (oldDevice === null) {
            res.status(404);
            throw new Error(`Dispositivo con id=${id} non trovato.`);
        }

        if (device.id && device.id !== id) {
            res.status(400);
            throw new Error(`Non è possibile modificare l'id del dispositivo.`);
        }

        if (device.din != undefined) {
            res.status(400);
            throw new Error(`Non è possibile modificare il din del dispositivo da questo endpoint.`);
        }

        if (device.device_model != undefined) {
            res.status(400);
            throw new Error(`Non è possibile modificare il device_model del dispositivo da questo endpoint.`);
        }

        const updatedRows = await Device.update(device, { where: { id }, transaction: t });

        if (updatedRows === 0) {
            res.status(404);
            throw new Error(`Non è stato possibile aggiornare il dispositivo con id=${id}.`);
        }

        await t.commit();
        res.send({ message: "Dispositivo aggiornato con successo." });
    }
    catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});

router.delete('/devices/:id', async function (req, res) {
    try {
        const id = parseInt(req.params.id);
        const deletedRows = await Device.destroy({ where: { id } });

        if (deletedRows === 0) {
            res.status(404);
            throw new Error(`Dispositivo con id=${id} non trovato.`);
        }

        res.send({ message: "Dispositivo eliminato con successo." });
    }
    catch (err) {
        sendError(res, err);
    }
});

//#endregion

//#region DDOs

router.get('/devices/:id/ddos', async function (req, res) {
    const t = await db.sequelize.transaction();
    try {
        const { limit, offset } = getPaginationParams(req);
        const sent = req.query.sent === 'true';
        console.log(`[API] sent=${sent}`);

        const deviceId = parseInt(req.params.id);
        const device = await Device.findByPk(deviceId, { transaction: t });
        if (device === null) {
            res.status(404);
            throw new Error(`Dispositivo con id=${deviceId} non trovato.`);
        }

        let where = {};
        if (sent) {
            where = { din_id_src: device.din_id };
        }
        else {
            where = { din_id_dst: device.din_id };
        }
        const countAndData = await DDO.findAndCountAll({ where, limit, offset, transaction: t });
        await t.commit();
        
        res.send(toPaginationData(countAndData, limit, offset));
    }
    catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});


//#endregion

//#region Device Models

router.get('/device_models', async function (req, res) {
    try {
        const { limit, offset } = getPaginationParams(req);
        const q = getQuery(req);
        const where = q ? { description: { [Op.like]: `%${q}%` } } : {};
        const rowsAndCount = await DeviceModel.findAndCountAll({ where, limit, offset, include: ['device_group'] });
        
        res.send(addQuery(toPaginationData(rowsAndCount, limit, offset), q));
    }
    catch (err) {
        sendError(res, err);
    }
});

router.get('/device_models/:deviceModelId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelId);
        const deviceModel = await DeviceModel.findByPk(id, { include: ['device_group'] });

        if (deviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${id} non trovato.`);
        }

        res.send(deviceModel);
    }
    catch (err) {
        sendError(res, err);
    }
});

router.post('/device_models', async function (req, res) {
    try {
        const deviceModel = req.body;

        for (const field of ['device_group_id', 'description', 'serial']) {
            if (!deviceModel[field]) {
                res.status(400);
                throw new Error(`Il campo ${field} è obbligatorio.`);
            }
        }

        if (deviceModel.device_group) {
            res.status(400);
            throw new Error("Non è possibile aggiungere il device_group durante la creazione del device_model");
        }

        const deviceGroup = await DeviceModelGroup.findByPk(parseInt(deviceModel.device_group_id));
        if (deviceGroup === null) {
            res.status(404);
            throw new Error(`DeviceModelGroup con id=${deviceModel.device_group_id} non trovato.`);
        }

        for (const field of ['link_image', 'link_datasheet', 'link_userguide']) {
            if (deviceModel[field] && !deviceModel[field].match(/^http(s)?:\/\/.+/)) {
                res.status(400);
                throw new Error(`Il campo ${field} deve essere un URL.`);
            }
        }

        const newDeviceModel = await DeviceModel.create(deviceModel);
        res.send(newDeviceModel);
    }
    catch (err) {
        sendError(res, err);
    }
});

router.put('/device_models/:deviceModelId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelId);
        const deviceModel = req.body;

        const oldDeviceModel = await DeviceModel.findByPk(id);
        if (oldDeviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${id} non trovato.`);
        }

        if (deviceModel.id && deviceModel.id !== id) {
            res.status(400);
            throw new Error(`Non è possibile modificare l'id del device_model.`);
        }

        if (deviceModel.device_group != undefined) {
            res.status(400);
            throw new Error(`Non è possibile modificare il device_group del device_model da questo endpoint.`);
        }

        if (deviceModel.device_group_id && deviceModel.device_group_id !== oldDeviceModel.device_group_id) {
            
            const deviceGroup = await DeviceModelGroup.findByPk(parseInt(deviceModel.device_group_id));
            
            if (deviceGroup === null) {
                res.status(404);
                throw new Error(`DeviceModelGroup con id=${deviceModel.device_group_id} non trovato.`);
            }
        }

        for (const field of ['link_image', 'link_datasheet', 'link_userguide']) {
            if (deviceModel[field] && !deviceModel[field].match(/^http(s)?:\/\/.+/)) {
                res.status(400);
                throw new Error(`Il campo ${field} deve essere un URL.`);
            }
        }

        const updatedRows = await DeviceModel.update(deviceModel, { where: { id } });

        if (updatedRows === 0) {
            res.status(404);
            throw new Error(`Non è stato possibile aggiornare il device_model con id=${id}.`);
        }

        res.send({ message: "DeviceModel aggiornato con successo." });
    }
    catch (err) {
        sendError(res, err);
    }
});

router.delete('/device_models/:deviceModelId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelId);
        const deletedRows = await DeviceModel.destroy({ where: { id } });

        if (deletedRows === 0) {
            res.status(404);
            throw new Error(`DeviceModel con id=${id} non trovato.`);
        }
        res.send({ message: "DeviceModel eliminato con successo." });
    }
    catch (err) {
        sendError(res, err);
    }
});


router.get('/device_models/:deviceModelId/devices', async function (req, res) {
    try {
        const { limit, offset } = getPaginationParams(req);

        const deviceModelId = parseInt(req.params.deviceModelId);
        const deviceModel = await DeviceModel.findByPk(deviceModelId);
        if (deviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${deviceModelId} non trovato.`);
        }
        const q = getQuery(req);
        const where = q ? { name: { [Op.like]: `%${q}%` } } : {};
        where.device_model_id = deviceModelId;

        const rowsAndCount = await Device.findAndCountAll({ where, limit, offset });
        res.send(addQuery(toPaginationData(rowsAndCount, limit, offset), q));
    }
    catch (err) {
        sendError(res, err);
    }
});

//#endregion

//#region Device Model Groups

router.get('/device_model_groups', async function (req, res) {
    try {
        const { limit, offset } = getPaginationParams(req);
        const q = getQuery(req);
        const where = q ? { title: { [Op.like]: `%${q}%` } } : {};
        const rowsAndCount = await DeviceModelGroup.findAndCountAll({ where, limit, offset });
        res.send(addQuery(toPaginationData(rowsAndCount, limit, offset), q));
    }
    catch (err) {
        sendError(res, err);
    }
});

router.get('/device_model_groups/:deviceModelGroupId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelGroupId);
        const deviceModelGroup = await DeviceModelGroup.findByPk(id);

        if (deviceModelGroup === null) {
            res.status(404);
            throw new Error(`DeviceModelGroup con id=${id} non trovato.`);
        }

        res.send(deviceModelGroup);
    }
    catch (err) {
        sendError(res, err);
    }
});


router.post('/device_model_groups', async function (req, res) {
    try {
        const deviceModelGroup = req.body;

        if (!deviceModelGroup.title) {
            res.status(400);
            throw new Error("Il campo title è obbligatorio, non può essere vuoto e deve essere diverso da gli altri title già presenti.");
        }

        const newDeviceModelGroup = await DeviceModelGroup.create(deviceModelGroup);
        res.send(newDeviceModelGroup);
    }
    catch (err) {
        sendError(res, err);
    }
});


router.put('/device_model_groups/:deviceModelGroupId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelGroupId);
        const deviceModelGroup = req.body;

        const oldDeviceModelGroup = await DeviceModelGroup.findByPk(id);
        if (oldDeviceModelGroup === null) {
            res.status(404);
            throw new Error(`DeviceModelGroup con id=${id} non trovato.`);
        }

        if (deviceModelGroup.id && deviceModelGroup.id !== id) {
            res.status(400);
            throw new Error(`Non è possibile modificare l'id del device_model_group.`);
        }

        const updatedRows = await DeviceModelGroup.update(deviceModelGroup, { where: { id } });

        if (updatedRows === 0) {
            res.status(404);
            throw new Error(`Non è stato possibile aggiornare il device_model_group con id=${id}.`);
        }

        res.send({ message: "DeviceModelGroup aggiornato con successo." });
    }
    catch (err) {
        sendError(res, err);
    }
});

router.delete('/device_model_groups/:deviceModelGroupId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelGroupId);
        const deletedRows = await DeviceModelGroup.destroy({ where: { id } });

        if (deletedRows === 0) {
            res.status(404);
            throw new Error(`DeviceModelGroup con id=${id} non trovato.`);
        }
        res.send({ message: "DeviceModelGroup eliminato con successo." });
    }
    catch (err) {
        sendError(res, err);
    }
});


router.get('/device_model_groups/:deviceModelGroupId/device_models', async function (req, res) {
    try {
        const deviceModelGroupId = parseInt(req.params.deviceModelGroupId);
        const { limit, offset } = getPaginationParams(req);
        const q = getQuery(req);
        
        
        const deviceModelGroup = await DeviceModelGroup.findByPk(deviceModelGroupId);
        if (deviceModelGroup === null) {
            res.status(404);
            throw new Error(`DeviceModelGroup con id=${deviceModelGroupId} non trovato.`);
        }
        const where = q ? { description: { [Op.like]: `%${q}%` } } : {};
        where.device_group_id = deviceModelGroupId;
        
        const rowsAndCount = await DeviceModel.findAndCountAll({ where, limit, offset });

        res.send(addQuery(toPaginationData(rowsAndCount, limit, offset), q));
    }
    catch (err) {
        sendError(res, err)
    }

});


//#endregion

router.all('*', function (req, res) {
    res.status(404);
    res.send({
        error_name: "NotFound",
        message: "Endpoint non trovato."
    });
});


//#region Utility functions

function sendError(res, error, status) {

    // 200 è lo stato di default, se non è stato impostato uno stato custom usa quello passato alla funzione
    if (res.statusCode === 200) {
        res.status(status || 500);
    }
    res.send({
        error_name: error.name,
        message: error.message,
    })
    console.error(`[daas] ${error.name} code ${res.statusCode}: ${error.message}\n${error.stack}`);
}

function getPaginationParams(req) {
    let limit = DEFAULT_PAGE_LIMIT;
    let offset = 0;
    if (req.query.limit != undefined) {
        limit = parseInt(req.query.limit);
        limit = Math.min(limit, MAX_PAGE_LIMIT);
        limit = Math.max(limit, 0);
        // 0 <= limit <= MAX_PAGE_LIMIT
    }

    if (req.query.offset != undefined) {
        offset = parseInt(req.query.offset);
        offset = Math.max(offset, 0);
        // offset >= 0
    }

    return { limit, offset };
}

function toPaginationData(countAndRows, limit, offset) {
    return {
        data: countAndRows.rows,
        pagination: {
            limit,
            offset,
            count: countAndRows.rows.length,
            total: countAndRows.count,
            has_next: countAndRows.count > offset + limit,
            has_prev: offset > 0,
        }
    }
}

function getQuery(req) {
    let q = req.query.q || '';
    // if q is an array, take the first element
    if (Array.isArray(q)) {
        q = q[0];
    }
    return q;
}

function addQuery(data, q) {
    if (q) {
        data.q = q;
    }
    return data;
}

//#endregion

module.exports = router;
