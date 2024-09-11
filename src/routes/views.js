/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: views.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * vincenzo.petrungaro@gmail.com - initial implementation
 *
 */

const express = require('express');
const router = express.Router();

const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

router.get('/', (req, res) => {
    res.render("pages/index", { host, port });
});

module.exports = router;

