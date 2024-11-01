const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { DeviceModel, DeviceModelGroup, Device, DeviceModelResource } = require('../../db/models');
const { getPaginationParams, getQuery, sendError, toPaginationData, addQuery } = require('./utilities');

module.exports = router;

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
        const deviceModel = await DeviceModel.findByPk(id, { include: ['device_group', 'resources'] });

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


router.get('/device_models/:deviceModelId/resources', async function (req, res) {
    try {
        const deviceModelId = parseInt(req.params.deviceModelId);
        let resource_type = parseInt(req.query.type);
        if (isNaN(resource_type)) {
            resource_type = null;
            if (req.query.type) {
                res.status(400);
                throw new Error("Il parametro type deve essere un intero compreso tra 1 e 5.");
            }
        }
        else if (resource_type < 1 || resource_type > 5) {
            res.status(400);
            throw new Error("Il parametro type deve essere un intero compreso tra 1 e 5.");
        }


        const where = { device_model_id: deviceModelId };
        if (resource_type) {
            where.resource_type = resource_type;
        }

        const resources = await DeviceModelResource.findAll({ where});

        res.send(resources);
    }
    catch (err) {
        sendError(res, err);
    }
});


router.post('/device_models/:deviceModelId/resources', async function (req, res) {
    const t = await DeviceModel.sequelize.transaction();
    try {
        const deviceModelId = parseInt(req.params.deviceModelId);
        const resource = req.body;
        resource.device_model_id = deviceModelId;

        const deviceModel = await DeviceModel.findByPk(deviceModelId, { transaction: t });
        if (deviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${deviceModelId} non trovato.`);
        }

        for (const field of ['name', 'link', 'resource_type']) {
            if (!resource[field]) {
                res.status(400);
                throw new Error(`Il campo ${field} è obbligatorio.`);
            }
        }

        resource.resource_type = parseInt(resource.resource_type);
        if (resource.resource_type < 1 || resource.resource_type > 5) {
            res.status(400);
            throw new Error("Il campo resource_type deve essere un intero compreso tra 1 e 5.");
        }

        const newResource = await DeviceModelResource.create(resource, { transaction: t });
        await t.commit();
        res.send(newResource);
    }
    catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});

router.delete('/device_models/:deviceModelId/resources/:resourceId', async function (req, res) {
    const t = await DeviceModel.sequelize.transaction();
    try {
        const deviceModelId = parseInt(req.params.deviceModelId);
        const resourceId = parseInt(req.params.resourceId);

        const resource = await DeviceModelResource.findByPk(resourceId, { transaction: t });
        if (resource === null) {
            res.status(404);
            throw new Error(`Resource con id=${resourceId} non trovato.`);
        }

        if (resource.device_model_id !== deviceModelId) {
            res.status(404);
            throw new Error(`Resource con id=${resourceId} non appartiene al DeviceModel con id=${deviceModelId}.`);
        }

        await DeviceModelResource.destroy({ where: { id: resourceId }, transaction: t });
        await t.commit();
        res.send({ message: "Resource eliminato con successo." });
    }
    catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});
