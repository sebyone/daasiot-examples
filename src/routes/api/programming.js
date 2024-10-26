const express = require('express');
const router = express.Router();

const { sendError, getPaginationParams, toPaginationData } = require('./utilities');
const { DeviceModel, DeviceModelFunction, DeviceModelFunctionProperty } = require('../../db/models');
const db = require('../../db/models');


module.exports = router;

const fake_device_model_function = {
  id: 1,
  name: 'switch',
  device_model_id: 1,
  parameters: [
    {
      id: 1,
      property_type: 1, // # 1 => parameter, 2 => input, 3 => output, 4 => notification
      name: 'mode',
      function_id: 1,
      data_type: 1,
      // # data_type:
      // # 1 => i32
      // # 2 => i16
      // # 3 => f32
      // # ...
      default_value: 1,
      safe_value: 1,
    },
    {
      id: 2,
      property_type: 1,
      function_id: 1,
      name: 'delay',
      data_type: 3,
      default_value: 1,
      safe_value: 1,
    }
  ],
  inputs: [
    {
      id: 5,
      property_type: 2,
      function_id: 1,
      name: 'trigger',
      data_type: 1,
      default_value: 2,
      safe_value: 2,
    },
  ],
  outputs: [],
  notifications: []
}

// tira fuori tutti i parametri associati ad una funzione del device
// id_device_function parametro della funzione (quelle associate dall'endpoint )
const fake_device_function = {
  id: 4,
  device_id: 1,
  device_model_function_id: 1,
  enabled: true,
  function: fake_device_model_function,
  parameters: [
    {
      id: 123,
      param_id: 1,
      device_function_id: 4,
      value: 2,
      parameter_template: {
        id: 1,
        property_type: 1,
        name: 'mode',
        function_id: 1,
        data_type: 1,
        default_value: 1,
        safe_value: 1,
      }
    },
    {
      id: 155,
      param_id: 2,
      device_function_id: 4,
      value: 1,
      parameter_template: {
        id: 2,
        property_type: 1,
        function_id: 1,
        name: 'delay',
        data_type: 3,
        default_value: 1,
        safe_value: 1,
      }
    }
  ],
  inputs: [
    {
      id: 198,
      param_id: 5,
      device_function_id: 4,
      value: 2,
      parameter_template: {
        id: 5,
        property_type: 2,
        function_id: 1,
        name: 'trigger',
        data_type: 1,
        default_value: 2,
        safe_value: 2,
      }
    }
  ],
  outputs: [],
  notifications: []
}



const DEV_MOD_PROPERTY_TYPE_LIST = ['parameters', 'inputs', 'outputs', 'notifications'];

const DEV_MOD_PROPERTY_TYPE_MAP = {
  1: 'parameters',
  2: 'inputs',
  3: 'outputs',
  4: 'notifications'
}

const DEV_MOD_PROPERTY_TYPE_MAP_REVERSE = {
  'parameters': 1,
  'inputs': 2,
  'outputs': 3,
  'notifications': 4
}

const DEV_MOD_DEFAULT_VALUE_MAP = {
  // i32
  1: '1',
  // i16
  2: '1',
  // f32
  3: '1.0',
  // string
  4: '',
}

router.get('/device_models/any/functions/', async function (req, res) {
  try {
    const { limit, offset } = getPaginationParams(req);

    const deviceModelFunctions = await DeviceModelFunction.findAndCountAll({
      include: [
        'parameters', 'inputs', 'outputs', 'notifications'
      ],
      subQuery: true,
      limit, offset,
    });


    res.send(toPaginationData(deviceModelFunctions, limit, offset));
  }
  catch (err) {
    sendError(res, err);
  }
});

router.get('/device_models/:deviceModelId/functions/', async function (req, res) {
  const deviceModelId = parseInt(req.params.deviceModelId);
  try {
    const deviceModel = await DeviceModel.findByPk(deviceModelId, {
      include: [
        {
          model: DeviceModelFunction,
          as: 'functions',
          include: DEV_MOD_PROPERTY_TYPE_LIST
        }
      ]
    });

    if (deviceModel === null) {
      res.status(404);
      throw new Error(`DeviceModel con id=${deviceModelId} non trovato.`);
    }

    res.send(deviceModel.functions);
  }
  catch (err) {
    sendError(res, err);
  }
});

router.get('/device_models/:deviceModelId/functions/:dmFuntionId', async function (req, res) {
  try {
    const deviceModelId = req.params.deviceModelId;
    const dmFuntionId = parseInt(req.params.dmFuntionId);

    const deviceModelFunction = await DeviceModelFunction.findByPk(dmFuntionId, {
      include: DEV_MOD_PROPERTY_TYPE_LIST
    });

    if (deviceModelFunction === null) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non trovato.`);
    }


    if (deviceModelId != 'any' && deviceModelFunction.device_model_id !== parseInt(deviceModelId)) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non appartiene al DeviceModel con id=${deviceModelId}.`);
    }

    res.send(deviceModelFunction);
  }
  catch (err) {
    sendError(res, err);
  }
});

router.post('/device_models/:deviceModelId/functions/', async function (req, res) {
  const t = await db.sequelize.transaction();
  try {
    const deviceModelId = parseInt(req.params.deviceModelId);
    const deviceModelFunction = req.body;

    console.log(deviceModelFunction);

    if (!deviceModelFunction) {
      res.status(400);
      throw new Error("Il body della richiesta è vuoto.");
    }

    if (!deviceModelFunction.name) {
      res.status(400);
      throw new Error("Il campo name è obbligatorio.");
    }

    if (deviceModelFunction.device_model_id && deviceModelFunction.device_model_id !== deviceModelId) {
      res.status(400);
      throw new Error("Il campo device_model_id non corrisponde all'id del DeviceModel.");
    }
    deviceModelFunction.device_model_id = deviceModelId;

    const deviceModel = await DeviceModel.findByPk(deviceModelId, { transaction: t });
    if (deviceModel === null) {
      res.status(404);
      throw new Error(`DeviceModel con id=${deviceModelId} non trovato.`);
    }

    const newDeviceModelFunction = await DeviceModelFunction.create(deviceModelFunction, { transaction: t });
    
    for (const property_list of DEV_MOD_PROPERTY_TYPE_LIST) {
      const property_type = DEV_MOD_PROPERTY_TYPE_MAP_REVERSE[property_list];

      console.log(property_list, property_type);
      console.log(deviceModelFunction[property_list]);


      if (deviceModelFunction[property_list]) {
        for (const property of deviceModelFunction[property_list]) {
          await createDeviceModelFunctionProperty(res, property, newDeviceModelFunction, property_type, t);
        }
      }
    }

    const deviceModelFunctionWithProperties = await DeviceModelFunction.findByPk(newDeviceModelFunction.id, {
      include: DEV_MOD_PROPERTY_TYPE_LIST,
      transaction: t,
    });

    await t.commit();
    res.send(deviceModelFunctionWithProperties);
  }
  catch (err) {
    await t.rollback();
    sendError(res, err);
  }
});


router.put('/device_models/:deviceModelId/functions/:dmFuntionId', async function (req, res) {
  const t = await db.sequelize.transaction();
  try {
    const deviceModelId = parseInt(req.params.deviceModelId);
    const dmFuntionId = parseInt(req.params.dmFuntionId);
    const deviceModelFunction = req.body;

    if (!deviceModelFunction) {
      res.status(400);
      throw new Error("Il body della richiesta è vuoto.");
    }

    if (deviceModelFunction.device_model_id && deviceModelFunction.device_model_id !== deviceModelId) {
      res.status(400);
      throw new Error("Il campo device_model_id non corrisponde all'id del DeviceModel.");
    }

    const oldDeviceModelFunction = await DeviceModelFunction.findByPk(dmFuntionId, { transaction: t, include: DEV_MOD_PROPERTY_TYPE_LIST });

    if (oldDeviceModelFunction === null) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non trovato.`);
    }

    if (oldDeviceModelFunction.device_model_id !== deviceModelId) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non appartiene al DeviceModel con id=${deviceModelId}.`);
    }

    if (deviceModelFunction.device_model_id) {
      oldDeviceModelFunction.device_model_id = deviceModelFunction.device_model_id;
    }

    if (deviceModelFunction.name) {
      oldDeviceModelFunction.name = deviceModelFunction.name;
    }

    for (const property_list of DEV_MOD_PROPERTY_TYPE_LIST) {
      if (deviceModelFunction[property_list]) {
        for (const property of deviceModelFunction[property_list]) {
          if (property.id) {
            const oldProperty = oldDeviceModelFunction[property_list].find(p => p.id === property.id);
            if (oldProperty) {
              await updateDeviceModelFunctionProperty(res, oldProperty, property, oldDeviceModelFunction, t);
            }
            else {
              res.status(404);
              throw new Error(`Property con id=${property.id} non trovato.`);
            }
          }
          else {
            const property_type = DEV_MOD_PROPERTY_TYPE_MAP_REVERSE[property_list]
            await createDeviceModelFunctionProperty(res, property, oldDeviceModelFunction, property_type, t);
          }
        }
      }
    }

    const updated = await oldDeviceModelFunction.save({ transaction: t });
    
    if (!updated) {
      res.status(500);
      throw new Error("Errore durante il salvataggio del DeviceModelFunction.");
    }

    await t.commit();

    res.send({ message: `DeviceModelFunction con id=${dmFuntionId} aggiornato con successo.`});
  }
  catch (err) {
    await t.rollback();
    sendError(res, err);
  }

});


router.delete('/device_models/:deviceModelId/functions/:dmFuntionId', async function (req, res) {
  const t = await db.sequelize.transaction();
  try {
    const deviceModelId = parseInt(req.params.deviceModelId);
    const dmFuntionId = parseInt(req.params.dmFuntionId);

    const deviceModelFunction = await DeviceModelFunction.findByPk(dmFuntionId, { transaction: t });

    if (deviceModelFunction === null) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non trovato.`);
    }

    if (deviceModelFunction.device_model_id !== deviceModelId) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non appartiene al DeviceModel con id=${deviceModelId}.`);
    }

    await deviceModelFunction.destroy({ transaction: t });
    await t.commit();
    res.send({ message: `DeviceModelFunction con id=${dmFuntionId} eliminato con successo.`});
  }
  catch (err) {
    await t.rollback();
    sendError(res, err);
  }
});


router.delete('/device_models/:deviceModelId/functions/:dmFuntionId/properties/:propertyId', async function (req, res) {
  const t = await db.sequelize.transaction();
  try {
    const deviceModelId = parseInt(req.params.deviceModelId);
    const dmFuntionId = parseInt(req.params.dmFuntionId);
    const propertyId = parseInt(req.params.propertyId);

    const property = await DeviceModelFunctionProperty.findByPk(propertyId, { transaction: t });

    if (property === null) {
      res.status(404);
      throw new Error(`Property con id=${propertyId} non trovato.`);
    }

    if (property.function_id !== dmFuntionId) {
      res.status(404);
      throw new Error(`Property con id=${propertyId} non appartiene alla DeviceModelFunction con id=${dmFuntionId}.`);
    }

    const deviceModelFunction = await DeviceModelFunction.findByPk(dmFuntionId, { transaction: t });

    if (deviceModelFunction === null) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non trovato.`);
    }

    if (deviceModelFunction.device_model_id !== deviceModelId) {
      res.status(404);
      throw new Error(`DeviceModelFunction con id=${dmFuntionId} non appartiene al DeviceModel con id=${deviceModelId}.`);
    }

    await property.destroy({ transaction: t });
    await t.commit();
    res.send({ message: `Property '${property.name}' con id=${propertyId} eliminata con successo.`});
  }
  catch (err) {
    await t.rollback();
    sendError(res, err);
  }
});


router.get('/devices/:deviceId/functions/', async function (req, res) {
  // 
  res.send([fake_device_function]);
});

router.get('/devices/:deviceId/functions/:dFuntionId', async function (req, res) {
  res.send(fake_device_function);
});

router.post('/devices/:deviceId/functions/', async function (req, res) {
  // select salva l'id della funzione


  // creare riga per il device dove salva l'ID della funzione e un campo selected
  // id_device_function


  sendError(res, new Error("Not yet implemented."), 501);
});

router.all('/devices/:deviceId/functions/:dFuntionId', function (req, res) {
  sendError(res, new Error("Not yet implemented."), 501);
});



function validateWithPropertyValueType(property, value) {
  switch (property.data_type) {
    case 1:
      return Number.isInteger(value);
    case 2:
      return Number.isInteger(value);
    case 3:
      return typeof value === 'number';
    case 4:
      return typeof value === 'string';
    default:
      return false;
  }
}

async function createDeviceModelFunctionProperty(res, property, deviceModelFunction, property_type, t) {
  property.property_type = property_type;
  property.function_id = deviceModelFunction.id;

  const property_list = DEV_MOD_PROPERTY_TYPE_MAP[property_type];

  if (property.name === undefined) {
    res.status(400);
    throw new Error(`Il campo name è obbligatorio per tutti i ${property_list}.`);
  }

  if (property.data_type === undefined) {
    res.status(400);
    throw new Error(`Il campo data_type è obbligatorio per tutti i ${property_list}.`);
  }

  if (property.data_type < 1 || property.data_type > 4) {
    res.status(400);
    throw new Error(`Il campo data_type deve essere compreso tra 1 e 4.`);
  }

  if (property.default_value === undefined) {
    property.default_value = DEV_MOD_DEFAULT_VALUE_MAP[property.data_type];
  }
  else if (!validateWithPropertyValueType(property, property.default_value)) {
    res.status(400);
    throw new Error(`Il campo default_value non è valido per il tipo di dato.`);
  }

  if (property.safe_value === undefined) {
    property.safe_value = property.default_value;
  }
  else if (!validateWithPropertyValueType(property, property.safe_value)) {
    res.status(400);
    throw new Error(`Il campo safe_value non è valido per il tipo di dato.`);
  }

  return await deviceModelFunction.createProperty(property, { transaction: t });
}


async function updateDeviceModelFunctionProperty(res, oldProperty, newProperty, deviceModelFunction, t) {
  if (newProperty.name !== undefined) {
    oldProperty.name = newProperty.name;
  }

  if (newProperty.property_type !== undefined) {
    res.status(400);
    throw new Error(`Il campo property_type non può essere modificato. (property_id=${oldProperty.id})`);
  }

  let changed_data_type = false
  if (newProperty.data_type !== undefined) {
    oldProperty.data_type = newProperty.data_type;
    changed_data_type = true;
  }

  if (newProperty.default_value !== undefined) {

    if (newProperty.data_type < 1 || newProperty.data_type > 4) {
      res.status(400);
      throw new Error(`Il campo data_type deve essere compreso tra 1 e 4. (property_id=${oldProperty.id})`);
    }

    if (!validateWithPropertyValueType(oldProperty, newProperty.default_value)) {
      res.status(400);
      throw new Error(`Il campo default_value non è valido per il tipo di dato. (property_id=${oldProperty.id})`);
    }
    oldProperty.default_value = newProperty.default_value;
  }
  else if (changed_data_type) {
    if (!validateWithPropertyValueType(oldProperty, oldProperty.default_value)) {
      res.status(400);
      throw new Error(`Il campo default_value non è più valido per il nuovo tipo di dato assegnato. (property_id=${oldProperty.id})`);
    }
  }

  if (newProperty.safe_value !== undefined) {
    if (!validateWithPropertyValueType(oldProperty, newProperty.safe_value)) {
      res.status(400);
      throw new Error(`Il campo safe_value non è valido per il tipo di dato. (property_id=${oldProperty.id})`);
    }
    oldProperty.safe_value = newProperty.safe_value;
  }
  else if (changed_data_type) {
    if (!validateWithPropertyValueType(oldProperty, oldProperty.safe_value)) {
      res.status(400);
      throw new Error(`Il campo safe_value non è più valido per il nuovo tipo di dato assegnato. (property_id=${oldProperty.id})`);
    }
  }

  return await oldProperty.save({ transaction: t });
  
}
  