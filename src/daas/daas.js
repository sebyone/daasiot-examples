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
