/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: daas.js
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * vincenzo.petrungaro@gmail.com - initial implementation
 * alessio.farfaglia@gmail.com - maintenance and updates
 */

const { DaasIoT } = require("daas-sdk");
const hver = "nodeJS";

let nodeInstance = new DaasIoT(hver);

function configure(sid, din, drivers = [], devices = []) {
    nodeInstance.doInit(sid, din);

    drivers.forEach(driver => {
        nodeInstance.enableDriver(driver.type, driver.url);
        console.log(`Driver ${driver.type} on ${driver.url} enabled.`);
    });

    devices.forEach(device => {
        nodeInstance.map(device.din, device.driverType, device.url);
        console.log(`Device ${device.din} on ${device.driverType} : ${device.url} mapped.`);
    });

    return nodeInstance;
}

function getNode() {
    return nodeInstance;
}

function start() {
    return nodeInstance.doPerform();
}

function stop() {
    return nodeInstance.doEnd();
}

function restart() {
    nodeInstance.restart();
}

function send(din, typeset, data) {
    const located = nodeInstance.locate(din);

    if (!located) throw new Error(`Node ${din} could not be located!`)

    const timestampSeconds = Math.floor(new Date().getTime() / 1000);
    nodeInstance.push(din, typeset, timestampSeconds, data);
}

module.exports = {
    configure,
    start,
    stop,
    getNode,
    restart,
    send,
}
