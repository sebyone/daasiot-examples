const express = require('express');
const router = express.Router();
const { Op } = require("sequelize");
const { DeviceModel, DeviceModelGroup, Device, DeviceModelResource } = require('../../db/models');
const { getPaginationParams, getQuery, sendError, toPaginationData, addQuery } = require('./utilities');
const db = require('../../db/models');
const { createDeviceModelFunction } = require('./programming');
const { DEFAULT_DEVICE_MODEL_GROUP_ID } = require('./deviceModelGroups');



const PLACEHOLDER_DEVICE_MODEL_ID = 1;

module.exports = {
    router,
    PLACEHOLDER_DEVICE_MODEL_ID
};

router.get('/device_models', async function (req, res) {
    try {
        const { limit, offset } = getPaginationParams(req);
        const q = getQuery(req);
        // the query is contained in the description or name
        const where = q ? {
            [Op.or]: [
                { description: { [Op.like]: `%${q}%` } },
                { name: { [Op.like]: `%${q}%` } }
            ]
        } : {};
        const rowsAndCount = await DeviceModel.findAndCountAll({ where, limit, offset, include: ['device_group', 'resources'], subQuery: true });

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

router.get('/device_models/find/:deviceName', async function (req, res) {
    try {
        const deviceName = req.params.deviceName;
        const deviceModels = await DeviceModel.findAll({ include: ['device_group', 'resources'] });

        if (deviceModels === null) {
            res.status(404);
            throw new Error(`DeviceModel non trovato.`);
        }

        const similarModels = deviceModels
        .filter(model => deviceName.includes(model.name)) 
        .sort((a, b) => b.name.length - a.name.length);   

        if (similarModels.length === 0) {
            res.status(404);
            throw new Error(`Nessun DeviceModel simile al nome del dispositivo: ${deviceName}`);
        }
        res.send(similarModels);
    }
    catch (err) {
        sendError(res, err);
    }
});

router.post('/device_models', async function (req, res) {
    const t = await db.sequelize.transaction();
    try {
        const deviceModel = req.body;

        if (!deviceModel) {
            res.status(400);
            throw new Error("Il body della richiesta non può essere vuoto.");
        }

        for (const field of ['description', 'name']) {
            if (!deviceModel[field]) {
                res.status(400);
                throw new Error(`Il campo ${field} è obbligatorio.`);
            }
        }

        let deviceGroup = null;
        // se il device_group_id è specificato, lo uso per cercare il device_group
        if (deviceModel.device_group_id != undefined) {
            deviceGroup = await DeviceModelGroup.findByPk(parseInt(deviceModel.device_group_id), { transaction: t });
        }
        else if (deviceModel.device_group) {

            // se il device_group.id è specificato, lo uso per cercare il device_group
            if (deviceModel.device_group.id) {
                deviceGroup = await DeviceModelGroup.findByPk(parseInt(deviceModel.device_group.id), { transaction: t });
            }
            else {
                if (!deviceModel.device_group.title) {
                    res.status(400);
                    throw new Error("Il campo title è obbligatorio, non può essere vuoto e deve essere diverso da gli altri title già presenti.");
                }
                // cerco se esiste già un device_group con lo stesso title, se non esiste lo creo
                deviceGroup = await DeviceModelGroup.findOne({ where: { title: deviceModel.device_group.title }, transaction: t });

                if (deviceGroup === null) {
                    deviceGroup = await DeviceModelGroup.create(deviceModel.device_group, { transaction: t });
                }
            }
        }

        if (deviceGroup === null) {
            deviceModel.device_group_id = DEFAULT_DEVICE_MODEL_GROUP_ID;
        }
        else {
            deviceModel.device_group_id = deviceGroup.id
        }

        const newDeviceModel = await DeviceModel.create(deviceModel, { transaction: t });

        if (deviceModel.resources) {
            for (const resource of deviceModel.resources) {
                await createResource(newDeviceModel.id, resource, t);
            }
        }

        if (deviceModel.functions) {
            for (const func of deviceModel.functions) {
                await createDeviceModelFunction(req, res, newDeviceModel.id, func, t);
            }
        }

        await t.commit();

        const fullDeviceModel = await DeviceModel.findByPk(newDeviceModel.id, { include: ['device_group', 'resources', 'functions'] });

        res.send(fullDeviceModel);
    }
    catch (err) {
        await t.rollback();
        sendError(res, err);
    }
});

router.put('/device_models/:deviceModelId', async function (req, res) {
    try {
        const id = parseInt(req.params.deviceModelId);
        const deviceModel = req.body;

        if (id === PLACEHOLDER_DEVICE_MODEL_ID) {
            res.status(400);
            throw new Error(`Il device_model con id=${PLACEHOLDER_DEVICE_MODEL_ID} è un placeholder e non può essere modificato.`);
        }

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

        if (id === PLACEHOLDER_DEVICE_MODEL_ID) {
            res.status(400);
            throw new Error(`Il device_model con id=${PLACEHOLDER_DEVICE_MODEL_ID} è un placeholder e non può essere eliminato.`);
        }

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

        const resources = await DeviceModelResource.findAll({ where });

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

        if (deviceModelId === PLACEHOLDER_DEVICE_MODEL_ID) {
            res.status(400);
            throw new Error(`Il device_model con id=${PLACEHOLDER_DEVICE_MODEL_ID} è un placeholder e non può avere risorse.`);
        }

        const resource = req.body;
        resource.device_model_id = deviceModelId;

        const deviceModel = await DeviceModel.findByPk(deviceModelId, { transaction: t });
        if (deviceModel === null) {
            res.status(404);
            throw new Error(`DeviceModel con id=${deviceModelId} non trovato.`);
        }

        const newResource = await createResource(deviceModelId, resource, t);
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

        if (deviceModelId === PLACEHOLDER_DEVICE_MODEL_ID) {
            res.status(400);
            throw new Error(`Il device_model con id=${PLACEHOLDER_DEVICE_MODEL_ID} è un placeholder e non può avere risorse.`);
        }

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



async function createResource(deviceModelId, resource, t) {
    resource.device_model_id = deviceModelId;

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

    return DeviceModelResource.create(resource, { transaction: t });
}
