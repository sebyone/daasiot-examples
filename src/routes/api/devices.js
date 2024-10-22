const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { Device, DeviceModel, Din, DDO } = require('../../db/models');
const db = require('../../db/models');
const { getPaginationParams, getQuery, sendError, toPaginationData, addQuery } = require('./utilities');

module.exports = router;


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

        // we're modifying the din
        if (device.din != undefined) {
            // we can't modify the din_id at the same time
            if (device.din_id && device.din_id !== oldDevice.din_id) {
                res.status(400);
                throw new Error(`Non è possibile modificare il din_id del dispositivo.`);
            }

            const din = device.din;
            const oldDin = await Din.findByPk(oldDevice.din_id, { transaction: t });
            
            if (oldDin === null) {
                res.status(404);
                throw new Error(`Din con id=${oldDevice.din_id} non trovato.`);
            }

            if (din.id && din.id !== oldDin.id) {
                res.status(400);
                throw new Error(`Non è possibile modificare l'id del din.`);
            }
            
            const updatedRowsDin = await Din.update(din, { where: { id: oldDin.id }, transaction: t });
            if (updatedRowsDin === 0) {
                res.status(404);
                throw new Error(`Non è stato possibile aggiornare il din con id=${oldDin.id}.`);
            }
            console.log(`[API] Updated din with id=${oldDin.id}`);
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
