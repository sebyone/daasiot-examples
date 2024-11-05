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
 * a.farfaglia@sebyone.it - rewrite and documentation
 *
 */

const express = require('express');
const router = express.Router();

// add all other api files here
// api.js                 deviceModelGroups.js  devices.js      receiversAndRemotes.js
// configAndLifecycle.js  deviceModels.js       programming.js  utilities.js

const deviceModelGroups = require('./deviceModelGroups');
const devices = require('./devices');
const receiversAndRemotes = require('./receiversAndRemotes');
const configAndLifecycle = require('./configAndLifecycle');
const deviceModels = require('./deviceModels');
const programming = require('./programming');

module.exports = router;

router.use(configAndLifecycle.router);

router.use(receiversAndRemotes.router);

router.use(devices.router);
router.use(deviceModels.router);
router.use(deviceModelGroups.router);

router.use(programming.router);

router.all('*', function (req, res) {
    res.status(404);
    res.send({
        error_name: "NotFound",
        message: "Endpoint non trovato."
    });
});

