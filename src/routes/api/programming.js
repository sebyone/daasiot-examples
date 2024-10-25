const express = require('express');
const router = express.Router();

const { sendError, getPaginationParams, toPaginationData } = require('./utilities');
const { DeviceModel, DeviceModelFunction } = require('../../db/models');
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
          include: ['parameters', 'inputs', 'outputs', 'notifications']
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
      include: ['parameters', 'inputs', 'outputs', 'notifications']
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


    if (deviceModelFunction.enabled === undefined) {
      deviceModelFunction.enabled = true;
    }

    const newDeviceModelFunction = await DeviceModelFunction.create(deviceModelFunction, { transaction: t });


    const default_value_map = {
      // i32
      1: '1',
      // i16
      2: '1',
      // f32
      3: '1.0',
      // string
      4: '',
    }

    const property_lists = ['parameters', 'inputs', 'outputs', 'notifications']

    let property_type = 0;
    for (const property_list of property_lists) {
      property_type += 1;

      console.log(property_list, property_type);
      console.log(deviceModelFunction[property_list]);


      if (deviceModelFunction[property_list]) {
        for (const property of deviceModelFunction[property_list]) {
          property.property_type = property_type;
          property.function_id = newDeviceModelFunction.id;

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
            property.default_value = default_value_map[property.data_type];
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

          await newDeviceModelFunction.createProperty(property, { transaction: t });
        }
      }
    }

    const deviceModelFunctionWithProperties = await DeviceModelFunction.findByPk(newDeviceModelFunction.id, {
      include: ['parameters', 'inputs', 'outputs', 'notifications'],
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


router.put('/device_models/:deviceModelId/functions/:dmFuntionId', function (req, res) {
  sendError(res, new Error("Not yet implemented."), 501);
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
    res.send(deviceModelFunction);
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
