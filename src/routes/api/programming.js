const express = require('express');
const router = express.Router();

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

router.get('/device_models/:deviceModelId/functions/', async function (req, res) {
    
    res.send([fake_device_model_function]);
});

router.get('/device_models/:deviceModelId/functions/:dmFuntionId', async function (req, res) {   
    res.send(fake_device_model_function);
});

router.post('/device_models/:deviceModelId/functions/', async function (req, res) {
    // 
    sendError(res, new Error("Not yet implemented."), 501);
});

router.all('/device_models/:deviceModelId/functions/:dmFuntionId', function (req, res) {
    sendError(res, new Error("Not yet implemented."), 501);
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


